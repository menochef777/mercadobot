import { Router } from 'express';
import VendaController from '../controlers/Venda';

const control = new VendaController();
const app = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Venda:
 *       type: object
 *       required:
 *         - valor
 *         - formaPagamento
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da venda (UUID)
 *         valor:
 *           type: number
 *           description: Valor total da venda
 *         formaPagamento:
 *           type: string
 *           description: "Forma de pagamento utilizada (ex: PIX, Dinheiro, Cartão)"
 *         cliente:
 *           type: string
 *           nullable: true
 *           description: Nome ou identificação do cliente
 *         itens:
 *           type: string
 *           nullable: true
 *           description: Resumo dos itens vendidos ou observação
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora da venda
 *     VendaInput:
 *       type: object
 *       required:
 *         - valor
 *       properties:
 *         valor:
 *           type: number
 *           example: 35.50
 *         formaPagamento:
 *           type: string
 *           example: "PIX"
 *         cliente:
 *           type: string
 *           example: "Dona Maria"
 *         itens:
 *           type: string
 *           example: "2x Leite, 1x Café"
 */

/**
 * @swagger
 * tags:
 *   name: Vendas
 *   description: "Gerenciamento e registro de vendas e caixa diário do mercadinho"
 */

/**
 * @swagger
 * /venda:
 *   post:
 *     summary: "Registrar uma nova venda no caixa"
 *     tags: [Vendas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendaInput'
 *     responses:
 *       201:
 *         description: "Venda registrada com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venda'
 *       400:
 *         description: "Dados inválidos"
 *       500:
 *         description: "Erro interno"
 */
app.post('/', control.post);

/**
 * @swagger
 * /venda/hoje:
 *   get:
 *     summary: "Obter todas as vendas do dia atual e o total acumulado do caixa"
 *     tags: [Vendas]
 *     responses:
 *       200:
 *         description: "Resumo e listagem das vendas de hoje"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 450.75
 *                 count:
 *                   type: integer
 *                   example: 12
 *                 vendas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venda'
 *       500:
 *         description: "Erro interno"
 */
app.get('/hoje', control.getHoje);

export default app;
