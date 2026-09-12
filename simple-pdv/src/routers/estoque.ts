import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import EstoqueController from '../controlers/Estoque';

const prisma = new PrismaClient();
const control = new EstoqueController();
const app = Router();

/**
 * @swagger
 * tags:
 *   name: Estoque
 *   description: "Gerenciamento e alertas de estoque do mercadinho"
 */

/**
 * @swagger
 * /estoque/alertas:
 *   get:
 *     summary: "Listar produtos com estoque baixo ou no limite (quantidadeAtual <= quantidadeMinima)"
 *     tags: [Estoque]
 *     responses:
 *       200:
 *         description: "Lista de produtos que necessitam de reposição"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   quantidadeAtual:
 *                     type: integer
 *                   quantidadeMinima:
 *                     type: integer
 *                   statusEstoque:
 *                     type: string
 *                     example: "ESTOQUE_BAIXO"
 *                   deficit:
 *                     type: integer
 *                     example: 5
 *       500:
 *         description: "Erro interno"
 */
app.get('/alertas', control.getAlertas);

/**
 * @swagger
 * /estoque/{productId}:
 *   patch:
 *     summary: "Atualizar ou repor quantidade de estoque do produto"
 *     tags: [Estoque]
 */
app.patch('/:productId', async (req, res) => {
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
