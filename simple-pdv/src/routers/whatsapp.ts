import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { enviarMensagem, formatarNumeroWhatsApp } from '../whatsapp/openwa';
import { lerNotaFiscal } from '../whatsapp/gemini';

const prisma = new PrismaClient();
const app = Router();

/**
 * Função utilitária para extrair base64 de imagens recebidas do OpenWA
 */
async function extrairBase64Imagem(messageData: any, payload: any): Promise<{ base64: string; mimetype: string } | null> {
  // 1. Base64 direto no payload
  const directBase64 =
    messageData.data ||
    messageData.base64 ||
    payload.data?.base64 ||
    payload.base64 ||
    messageData.media?.data;
  if (typeof directBase64 === 'string' && directBase64.length > 100) {
    const mimetype = messageData.mimetype || payload.data?.mimetype || 'image/jpeg';
    return { base64: directBase64.replace(/^data:image\/[a-z0-9-+.]+;base64,/i, ''), mimetype };
  }

  // 2. URL de mídia direta
  const mediaUrl =
    messageData.mediaUrl ||
    messageData.url ||
    payload.data?.mediaUrl ||
    payload.data?.url ||
    payload.url ||
    messageData.media?.url;

  if (mediaUrl && typeof mediaUrl === 'string' && mediaUrl.startsWith('http')) {
    try {
      const apiKey = process.env.OPENWA_API_KEY || 'sua-chave';
      const resp = await fetch(mediaUrl, {
        headers: { 'x-api-key': apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (resp.ok) {
        const buffer = await resp.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimetype = resp.headers.get('content-type') || messageData.mimetype || 'image/jpeg';
        return { base64, mimetype };
      }
    } catch (err) {
      console.warn('⚠️ [WhatsApp] Erro ao baixar imagem via mediaUrl:', err);
    }
  }

  // 3. Busca via endpoint de media do OpenWA
  const messageId = messageData.id || messageData.messageId || payload.data?.id || payload.id;
  const openwaUrl = (process.env.OPENWA_URL || 'http://localhost:2785').replace(/\/$/, '');
  const apiKey = process.env.OPENWA_API_KEY || 'sua-chave';
  const session = process.env.OPENWA_SESSION || 'mercadobot';

  if (messageId) {
    try {
      const endpoint = `${openwaUrl}/api/sessions/${session}/messages/${messageId}/media`;
      const resp = await fetch(endpoint, {
        headers: { 'x-api-key': apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (resp.ok) {
        const buffer = await resp.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimetype = resp.headers.get('content-type') || 'image/jpeg';
        return { base64, mimetype };
      }
    } catch (err) {
      console.warn('⚠️ [WhatsApp] Erro ao baixar imagem da API OpenWA:', err);
    }
  }

  return null;
}

/**
 * @swagger
 * /whatsapp/webhook:
 *   post:
 *     summary: Webhook receptor de mensagens do OpenWA / WhatsApp
 *     tags: [WhatsApp]
 *     responses:
 *       200:
 *         description: Webhook processado com sucesso
 */
app.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📩 PAYLOAD COMPLETO:', JSON.stringify(req.body, null, 2));
    const payload = req.body;

    // Log resumido do evento recebido
    console.log('📩 [Webhook WhatsApp] Evento recebido:', payload.event || payload.type || 'message');

    // Suporta diferentes estruturas de payload do OpenWA (wppconnect, whatsapp-web.js, openwa standard)
    const messageData = payload.data || payload.message || payload;

    // Ignora mensagens enviadas pelo próprio bot para evitar loops
    if (messageData.fromMe || payload.fromMe) {
      res.status(200).json({ status: 'ignored_from_me' });
      return;
    }

    // Extrai o remetente (chatId / JID de onde veio a mensagem)
    const rawSender =
      payload.data?.chatId ||
      messageData.chatId ||
      payload.data?.de ||
      messageData.from ||
      payload.chatId ||
      messageData.sender?.id ||
      messageData.author ||
      '';
    const senderNumber = formatarNumeroWhatsApp(String(rawSender));

    if (!senderNumber) {
      res.status(200).json({ status: 'no_sender' });
      return;
    }

    // Extrai texto e tipo da mensagem
    const textRaw = (
      messageData.body ||
      messageData.text ||
      messageData.content ||
      messageData.caption ||
      payload.data?.corpo ||
      payload.corpo ||
      ''
    ).trim();
    const textLower = textRaw.toLowerCase();

    const isMedia =
      messageData.hasMedia ||
      messageData.type === 'image' ||
      messageData.mimetype?.startsWith('image/') ||
      payload.type === 'image';

    // 1. Tratamento de Imagem / Foto de Nota Fiscal com IA
    if (isMedia) {
      console.log(`📸 [WhatsApp] Imagem de nota fiscal recebida de ${senderNumber}`);
      await enviarMensagem(
        senderNumber,
        '⏳ *Nota fiscal recebida!* Processando itens com Inteligência Artificial, aguarde um instante...'
      );

      try {
        const mediaInfo = await extrairBase64Imagem(messageData, payload);
        if (!mediaInfo || !mediaInfo.base64) {
          await enviarMensagem(
            senderNumber,
            '⚠️ Não foi possível baixar a imagem da nota fiscal para leitura. Por favor, tente enviar novamente.'
          );
          res.status(200).json({ status: 'media_download_failed' });
          return;
        }

        const produtosExtraidos = await lerNotaFiscal(mediaInfo.base64, mediaInfo.mimetype);

        if (!produtosExtraidos || produtosExtraidos.length === 0) {
          await enviarMensagem(
            senderNumber,
            '❓ Não conseguimos identificar nenhum produto legível nesta imagem. Verifique o enquadramento e iluminação da nota.'
          );
          res.status(200).json({ status: 'no_products_found' });
          return;
        }

        const produtosAtualizados = [];

        for (const item of produtosExtraidos) {
          // Busca produto existente no banco pelo nome
          const produtosExistentes = await prisma.product.findMany({
            where: {
              name: {
                contains: item.nome,
                mode: 'insensitive',
              },
            },
          });

          let produto = produtosExistentes[0];

          if (produto) {
            // Atualiza o estoque somando a nova quantidade
            const novaQtd = (produto.quantidadeAtual || 0) + item.quantidade;
            produto = await prisma.product.update({
              where: { productId: produto.productId },
              data: {
                quantidadeAtual: novaQtd,
                stockQuantity: (produto.stockQuantity || 0) + item.quantidade,
                costPrice: item.valorUnitario > 0 ? item.valorUnitario : produto.costPrice,
              },
            });
            produtosAtualizados.push({
              nome: produto.name,
              qtd: item.quantidade,
              totalEstoque: produto.quantidadeAtual,
              status: 'atualizado',
            });
          } else {
            // Cria produto novo automaticamente
            const randomCode = Math.floor(10000000 + Math.random() * 90000000).toString();
            produto = await prisma.product.create({
              data: {
                name: item.nome,
                description: item.nome,
                barcode: randomCode,
                sku: `SKU-${randomCode.slice(-6)}`,
                price: item.valorUnitario > 0 ? Number((item.valorUnitario * 1.35).toFixed(2)) : 10.0,
                costPrice: item.valorUnitario > 0 ? item.valorUnitario : 5.0,
                stockQuantity: item.quantidade,
                quantidadeAtual: item.quantidade,
                quantidadeMinima: 5,
              },
            });
            produtosAtualizados.push({
              nome: produto.name,
              qtd: item.quantidade,
              totalEstoque: produto.quantidadeAtual,
              status: 'novo',
            });
          }
        }

        const linhasResumo = produtosAtualizados
          .map(
            (p) =>
              `• *${p.nome}* (+${p.qtd} un) ➔ Estoque atual: *${p.totalEstoque} un* ${
                p.status === 'novo' ? '_(Novo cadastrado)_' : ''
              }`
          )
          .join('\n');

        const resposta = `🧾 *Nota Fiscal Processada com Sucesso!*\n\n📦 *Produtos atualizados (${produtosAtualizados.length} itens):*\n${linhasResumo}\n\n✅ Estoque atualizado automaticamente no sistema!`;

        await enviarMensagem(senderNumber, resposta);
        res.status(200).json({ status: 'nota_processada', produtos: produtosAtualizados });
        return;
      } catch (err: any) {
        console.error('❌ [WhatsApp] Erro ao processar nota fiscal:', err);
        await enviarMensagem(
          senderNumber,
          `❌ Ocorreu um erro ao processar a nota fiscal: ${err.message || 'Erro no leitor de IA'}`
        );
        res.status(200).json({ status: 'error_processing_nota', error: err.message });
        return;
      }
    }

    // Se não tiver texto, ignora
    if (!textRaw) {
      res.status(200).json({ status: 'empty_text' });
      return;
    }

    console.log(`💬 [WhatsApp] Mensagem de ${senderNumber}: "${textRaw}"`);

    // 2. Comando "fiado [nome]"
    if (textLower.startsWith('fiado')) {
      const nomeBusca = textRaw.replace(/^fiado\s*/i, '').trim();

      if (!nomeBusca) {
        await enviarMensagem(
          senderNumber,
          '❓ Por favor, informe o nome do cliente.\nExemplo: *fiado Seu Raimundo*'
        );
        res.status(200).json({ status: 'fiado_missing_name' });
        return;
      }

      // Busca fiados pendentes onde o nome do cliente contém a busca
      const fiados = await prisma.fiado.findMany({
        where: {
          status: 'PENDENTE',
        },
      });

      // Filtro insensível a maiúsculas/minúsculas
      const fiadosFiltrados = fiados.filter((f) =>
        f.nomeCliente.toLowerCase().includes(nomeBusca.toLowerCase())
      );

      if (fiadosFiltrados.length === 0) {
        await enviarMensagem(
          senderNumber,
          `✅ Nenhum fiado pendente encontrado para o cliente *"${nomeBusca}"*.`
        );
      } else {
        const total = fiadosFiltrados.reduce((acc, f) => acc + f.valor, 0);
        const linhas = fiadosFiltrados
          .map(
            (f) =>
              `• R$ ${f.valor.toFixed(2)} - ${f.descricao || 'Compras'} (${new Date(
                f.dataCriacao
              ).toLocaleDateString('pt-BR')})`
          )
          .join('\n');

        const resposta = `📋 *Fiados Pendentes — ${fiadosFiltrados[0].nomeCliente}*\n\n${linhas}\n\n💰 *Total a pagar: R$ ${total.toFixed(
          2
        )}*`;

        await enviarMensagem(senderNumber, resposta);
      }

      res.status(200).json({ status: 'fiado_processed' });
      return;
    }

    // 3. Comando "estoque" / "!estoque"
    if (textLower === 'estoque' || textLower === '!estoque' || textLower === 'alertas') {
      const produtos = await prisma.product.findMany();
      const alertas = produtos.filter((p) => p.quantidadeAtual <= p.quantidadeMinima);

      if (alertas.length === 0) {
        await enviarMensagem(
          senderNumber,
          '🎉 *Estoque em dia!* Nenhum produto com estoque crítico no momento.'
        );
      } else {
        const linhas = alertas
          .map(
            (p) =>
              `• *${p.name}*: ${p.quantidadeAtual} un (Mínimo: ${p.quantidadeMinima} un) — ${
                p.quantidadeAtual <= 0 ? '❌ ESGOTADO' : '⚠️ BAIXO'
              }`
          )
          .join('\n');

        const resposta = `⚠️ *Alertas de Estoque (${alertas.length} itens):*\n\n${linhas}\n\n💡 *Dica:* Faça o pedido de reposição aos fornecedores.`;
        await enviarMensagem(senderNumber, resposta);
      }

      res.status(200).json({ status: 'estoque_processed' });
      return;
    }

    // 4. Comando "caixa hoje" / "caixa" / "vendas hoje"
    if (
      textLower === 'caixa hoje' ||
      textLower === 'caixa' ||
      textLower === 'vendas hoje' ||
      textLower === '!caixa'
    ) {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const vendas = await prisma.venda.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const total = vendas.reduce((acc, v) => acc + v.valor, 0);

      const resposta = `💵 *Caixa de Hoje (${now.toLocaleDateString('pt-BR')}):*\n\n💰 *Total Acumulado:* R$ ${total.toFixed(
        2
      )}\n🛍️ *Vendas Realizadas:* ${vendas.length}\n⏱️ *Última atualização:* ${now.toLocaleTimeString(
        'pt-BR',
        { hour: '2-digit', minute: '2-digit' }
      )}`;

      await enviarMensagem(senderNumber, resposta);
      res.status(200).json({ status: 'caixa_processed' });
      return;
    }

    // 5. Comando de Ajuda / Menu Padrão
    if (
      textLower === 'ajuda' ||
      textLower === 'menu' ||
      textLower === 'oi' ||
      textLower === 'olá' ||
      textLower === 'ola'
    ) {
      const menu = `🤖 *GestorMercado Bot — Comandos Disponíveis:*\n\n` +
        `• *caixa hoje* — Ver total de vendas e caixa do dia\n` +
        `• *fiado [nome]* — Consultar fiados pendentes de um cliente\n` +
        `• *estoque* — Ver produtos com estoque crítico\n` +
        `• *Envie uma foto* de nota fiscal para confirmação de compras`;

      await enviarMensagem(senderNumber, menu);
      res.status(200).json({ status: 'menu_sent' });
      return;
    }

    // Mensagem não reconhecida
    res.status(200).json({ status: 'unhandled_command' });
  } catch (error: any) {
    console.error('❌ [Webhook WhatsApp] Erro ao processar webhook:', error);
    res.status(500).json({ error: 'Erro interno ao processar webhook do WhatsApp.' });
  }
});

// Endpoint GET simples para teste / health check
app.get('/webhook', (req: Request, res: Response) => {
  res.status(200).json({ status: 'online', service: 'GestorMercado OpenWA Webhook' });
});

export default app;
