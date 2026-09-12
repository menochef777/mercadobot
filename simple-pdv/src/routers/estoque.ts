import { Router } from 'express';
import EstoqueController from '../controlers/Estoque';

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

export default app;
