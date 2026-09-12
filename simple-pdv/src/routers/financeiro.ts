import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { criarEventoVencimento } from '../services/calendar';
import { validateBody } from '../midleware/validate';
import { contaPagarCreateSchema } from '../schemas';

const prisma = new PrismaClient();
const router = Router();

router.get('/contas-pagar', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status && status !== 'TODAS') {
      where.status = String(status);
    }

    const contas = await prisma.contaPagar.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const totalPendente = contas
      .filter((c) => c.status === 'PENDENTE')
      .reduce((acc, c) => acc + c.valor, 0);

    res.status(200).json({
      contas,
      totalPendente,
      count: contas.length,
    });
  } catch (error: any) {
    console.error('❌ [Financeiro] Erro ao buscar contas a pagar:', error);
    res.status(500).json({ error: 'Erro ao buscar contas a pagar.' });
  }
});

router.post('/contas-pagar', validateBody(contaPagarCreateSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomeFornecedor, valor, dataVencimento, status } = req.body;

    const nomeFornecedorFinal = nomeFornecedor || 'Fornecedor Avulso';
    const valorNum = Number(valor);

    const conta = await prisma.contaPagar.create({
      data: {
        nomeFornecedor: nomeFornecedorFinal,
        valor: valorNum,
        dataVencimento: dataVencimento || null,
        status: status || 'PENDENTE',
      },
    });

    // Se tiver data de vencimento, tenta criar evento no Google Calendar
    if (dataVencimento) {
      try {
        await criarEventoVencimento(nomeFornecedorFinal, valorNum, dataVencimento);
      } catch (errCal) {
        console.warn('⚠️ [Google Calendar] Falha ao criar evento no Calendar:', errCal);
      }
    }

    res.status(201).json(conta);
  } catch (error: any) {
    console.error('❌ [Financeiro] Erro ao criar conta a pagar:', error);
    res.status(500).json({ error: 'Erro ao criar conta a pagar.' });
  }
});

router.patch('/contas-pagar/:id/pagar', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const contaExist = await prisma.contaPagar.findUnique({ where: { id } });
    if (!contaExist) {
      res.status(404).json({ error: 'Conta a pagar não encontrada.' });
      return;
    }

    const conta = await prisma.contaPagar.update({
      where: { id },
      data: {
        status: 'PAGO',
      },
    });

    res.status(200).json({ message: 'Conta marcada como paga com sucesso.', conta });
  } catch (error: any) {
    console.error('❌ [Financeiro] Erro ao atualizar conta a pagar:', error);
    res.status(500).json({ error: 'Erro ao atualizar status da conta a pagar.' });
  }
});

export default router;
