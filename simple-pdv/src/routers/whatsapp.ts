import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { enviarMensagem, formatarNumeroWhatsApp } from '../whatsapp/openwa';

const prisma = new PrismaClient();
const app = Router();

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

    // 1. Tratamento de Imagem / Foto de Nota Fiscal
    if (isMedia) {
      console.log(`📸 [WhatsApp] Imagem recebida de ${senderNumber}`);
      await enviarMensagem(senderNumber, 'Nota recebida! Em breve processamos o estoque.');
      res.status(200).json({ status: 'media_processed' });
      return;
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
