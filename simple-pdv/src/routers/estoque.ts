import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import EstoqueController from '../controlers/Estoque';
import { validateBody } from '../midleware/validate';
import { estoqueUpdateSchema } from '../schemas';

const prisma = new PrismaClient();
const control = new EstoqueController();
const app = Router();

app.get('/alertas', control.getAlertas);

app.patch('/:productId', validateBody(estoqueUpdateSchema), async (req, res) => {
  const { productId } = req.params;
  const { quantidadeAtual, quantidadeMinima, adicionar } = req.body;
  try {
    const prod = await prisma.product.findUnique({ where: { productId } });
    if (!prod) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }
    const novaQtd = adicionar !== undefined
      ? Math.max(0, (prod.quantidadeAtual || 0) + Number(adicionar))
      : (quantidadeAtual !== undefined ? Math.max(0, Number(quantidadeAtual)) : prod.quantidadeAtual);
    
    const updated = await prisma.product.update({
      where: { productId },
      data: {
        quantidadeAtual: novaQtd,
        stockQuantity: novaQtd,
        ...(quantidadeMinima !== undefined && { quantidadeMinima: Math.max(0, Number(quantidadeMinima)) })
      }
    });
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao atualizar estoque: ' + err.message });
  }
});

export default app;
