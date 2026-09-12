import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { enviarMensagem } from '../whatsapp/openwa';

const prisma = new PrismaClient();

const diasDaSemana = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

export async function gerarRelatorio(): Promise<string> {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // 1. Vendas de Hoje
    const vendas = await prisma.venda.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    const totalVendas = vendas.reduce((acc, v) => acc + v.valor, 0);

    // 2. Fiados Pendentes
    const fiados = await prisma.fiado.findMany({
      where: {
        status: 'PENDENTE',
      },
    });
    const totalFiado = fiados.reduce((acc, f) => acc + f.valor, 0);
    const countFiadoClientes = fiados.length;

    // 3. Alertas de Estoque (onde quantidadeAtual <= quantidadeMinima)
    const produtos = await prisma.product.findMany();
    const alertasEstoque = produtos.filter((p) => p.quantidadeAtual <= p.quantidadeMinima);
    const produtosAcabando = alertasEstoque.length > 0
      ? alertasEstoque.map((p) => p.name).join(', ')
      : 'Nenhum item crítico';

    // 4. Fornecedores que visitam amanhã
    const amanhaIndex = (now.getDay() + 1) % 7;
    const nomeDiaAmanha = diasDaSemana[amanhaIndex];
    
    const fornecedoresAmanha = await prisma.fornecedor.findMany({
      where: {
        diaVisita: {
          contains: nomeDiaAmanha,
        },
      },
    });

    const infoFornecedores = fornecedoresAmanha.length > 0
      ? fornecedoresAmanha.map((f) => `${f.nome} (${f.produtos || 'Entregas'})`).join(', ')
      : 'Nenhuma visita programada';

    // Formatação da Mensagem do Relatório
    const relatorio = `📊 *GestorMercado — Resumo do dia* (${now.toLocaleDateString('pt-BR')})
💰 *Vendas hoje:* R$ ${totalVendas.toFixed(2)} (${vendas.length} vendas)
👤 *Fiado pendente:* R$ ${totalFiado.toFixed(2)} (${countFiadoClientes} clientes)
⚠️ *Acabando:* ${produtosAcabando}
🚚 *Amanhã (${nomeDiaAmanha}):* ${infoFornecedores}`;

    console.log('✅ [Relatório Diário] Conteúdo gerado:\n', relatorio);

    // Envio automático via WhatsApp para o número configurado
    const numeroDestino = process.env.NUMERO_TITO || '5511967634294';
    console.log(`📱 [Relatório Diário] Enviando via WhatsApp para: ${numeroDestino}...`);
    
    const resEnvio = await enviarMensagem(numeroDestino, relatorio);
    if (resEnvio.success) {
      console.log(`🎉 [Relatório Diário] Relatório enviado com sucesso via WhatsApp para ${numeroDestino}!`);
    } else {
      console.warn(`⚠️ [Relatório Diário] Falha ao enviar para o WhatsApp: ${resEnvio.error}`);
    }

    return relatorio;
  } catch (error) {
    console.error('Erro ao gerar/enviar relatório diário:', error);
    return 'Erro ao gerar relatório diário.';
  }
}

export async function verificarContasVencendo(): Promise<string | null> {
  try {
    const contasPendentes = await prisma.contaPagar.findMany({
      where: { status: 'PENDENTE' },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    const hojeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const limite3Dias = new Date(hojeStart.getTime() + 3 * 24 * 60 * 60 * 1000 + 23 * 59 * 59 * 999);

    const contasVencendo = contasPendentes.filter((c) => {
      if (!c.dataVencimento) return false;
      const clean = c.dataVencimento.trim();
      let dt: Date | null = null;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) {
        const [d, m, y] = clean.split('/').map(Number);
        dt = new Date(y, m - 1, d, 0, 0, 0);
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(clean)) {
        const [d, m, y] = clean.split('-').map(Number);
        dt = new Date(y, m - 1, d, 0, 0, 0);
      } else if (/^\d{4}-\d{2}-\d{2}/.test(clean)) {
        const [y, m, d] = clean.substring(0, 10).split('-').map(Number);
        dt = new Date(y, m - 1, d, 0, 0, 0);
      } else {
        const parsed = new Date(clean);
        dt = isNaN(parsed.getTime()) ? null : parsed;
      }

      if (!dt) return false;
      return dt <= limite3Dias;
    });

    if (contasVencendo.length === 0) {
      console.log('ℹ️ [Cron 8h - Financeiro] Nenhuma conta com vencimento próximo.');
      return null;
    }

    const linhas = contasVencendo
      .map((c) => `• ${c.nomeFornecedor} — R$ ${c.valor.toFixed(2)} — vence ${c.dataVencimento}`)
      .join('\n');

    const mensagem = `⚠️ Contas vencendo em breve:\n${linhas}`;

    const numeroDestino = process.env.NUMERO_TITO || '5511967634294';
    console.log(`📱 [Cron 8h - Financeiro] Enviando alerta de contas a pagar para ${numeroDestino}...`);
    await enviarMensagem(numeroDestino, mensagem);
    return mensagem;
  } catch (error) {
    console.error('❌ [Cron 8h - Financeiro] Erro ao verificar contas vencendo:', error);
    return null;
  }
}

export function initRelatorioJob() {
  // Executa todo dia às 08:00 para alertar contas a vencer nos próximos 3 dias
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ [Cron] Executando rotina diária das 08h: Verificação de contas vencendo...');
    await verificarContasVencendo();
  });

  // Executa todo dia às 18:00 (0 18 * * *)
  cron.schedule('0 18 * * *', async () => {
    console.log('⏰ [Cron] Executando rotina diária das 18h: Geração e envio do Relatório WhatsApp...');
    await gerarRelatorio();
  });

  console.log('📅 [Cron Job] Agendadores inicializados: 08:00 (Contas a vencer) e 18:00 (Relatório Diário).');
}

export default initRelatorioJob;
