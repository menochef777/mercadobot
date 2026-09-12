import { Router } from 'express';
import FiadoController from '../controlers/Fiado';

const control = new FiadoController();
const app = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Fiado:
 *       type: object
 *       required:
 *         - nomeCliente
 *         - valor
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do registro de fiado
 *         nomeCliente:
 *           type: string
 *           description: Nome do cliente que comprou fiado
 *         telefoneCliente:
 *           type: string
 *           description: Telefone de contato do cliente
 *         valor:
 *           type: number
 *           description: Valor da dívida
 *         descricao:
 *           type: string
 *           description: Descrição dos itens ou observação
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data e hora em que a dívida foi criada
 *         status:
 *           type: string
 *           enum: [PENDENTE, PAGO]
 *           description: Status do pagamento
 *         dataPagamento:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Data e hora em que foi feito o pagamento
 *     FiadoInput:
 *       type: object
 *       required:
 *         - nomeCliente
 *         - valor
 *       properties:
 *         nomeCliente:
 *           type: string
 *           example: "João da Silva"
 *         telefoneCliente:
 *           type: string
 *           example: "(81) 98888-7777"
 *         valor:
 *           type: number
 *           example: 45.50
 *         descricao:
 *           type: string
 *           example: "2kg de arroz, 1 óleo, 1 café"
 */

/**
 * @swagger
 * tags:
 *   name: Fiado
 *   description: Gerenciamento de compras no fiado (caderneta / fiado do mercadinho)
 */

/**
 * @swagger
 * /fiado:
 *   post:
 *     summary: Registrar uma nova conta no fiado
 *     tags: [Fiado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FiadoInput'
 *     responses:
 *       201:
 *         description: Fiado registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fiado'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */
app.post('/', control.post);

/**
 * @swagger
 * /fiado:
 *   get:
 *     summary: Listar todas as contas no fiado
 *     tags: [Fiado]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, PAGO]
 *         description: Filtrar por status (PENDENTE ou PAGO)
 *     responses:
 *       200:
 *         description: Lista de fiados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fiado'
 *       500:
 *         description: Erro interno
 */
app.get('/', control.get);

/**
 * @swagger
 * /fiado/{id}:
 *   get:
 *     summary: Obter detalhes de um fiado por ID
 *     tags: [Fiado]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fiado
 *     responses:
 *       200:
 *         description: Detalhes do fiado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fiado'
 *       404:
 *         description: Fiado não encontrado
 *       500:
 *         description: Erro interno
 */
app.get('/:id', control.getById);

/**
 * @swagger
 * /fiado/{id}/pagar:
 *   patch:
 *     summary: Marcar um fiado como PAGO
 *     tags: [Fiado]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fiado a ser quitado
 *     responses:
 *       200:
 *         description: Fiado marcado como pago com sucesso
 *       404:
 *         description: Fiado não encontrado
 *       400:
 *         description: Fiado já está pago
 *       500:
 *         description: Erro interno
 */
app.patch('/:id/pagar', control.pagar);

export default app;
