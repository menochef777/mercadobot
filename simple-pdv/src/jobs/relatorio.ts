import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

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

    // Formatação da Mensagem
    const relatorio = `📊 GestorMercado — Resumo do dia (${now.toLocaleDateString('pt-BR')})
💰 Vendas hoje: R$ ${totalVendas.toFixed(2)} (${vendas.length} vendas)
👤 Fiado pendente: R$ ${totalFiado.toFixed(2)} (${countFiadoClientes} clientes)
⚠️ Acabando: ${produtosAcabando}
🚚 Amanhã (${nomeDiaAmanha}): ${infoFornecedores}`;

    // Salva em relatorio-hoje.txt na raiz do backend e na raiz do workspace
    const backendRelatorioPath = path.resolve(__dirname, '../../relatorio-hoje.txt');
    const rootRelatorioPath = path.resolve(__dirname, '../../../relatorio-hoje.txt');

    fs.writeFileSync(backendRelatorioPath, relatorio, 'utf-8');
    try {
      fs.writeFileSync(rootRelatorioPath, relatorio, 'utf-8');
    } catch (e) {}

    console.log('✅ Relatório diário gerado e salvo em relatorio-hoje.txt:');
    console.log(relatorio);

    return relatorio;
  } catch (error) {
    console.error('Erro ao gerar relatório diário:', error);
    return 'Erro ao gerar relatório diário.';
  }
}

export function initRelatorioJob() {
  // Executa todo dia às 18:00 (0 18 * * *)
  cron.schedule('0 18 * * *', async () => {
    console.log('⏰ [Cron] Executando rotina diária das 18h: Geração do Relatório...');
    await gerarRelatorio();
  });

  console.log('📅 [Cron Job] Agendador de Relatório do WhatsApp inicializado (Horário: 18:00 diariamente).');
}

export default initRelatorioJob;
