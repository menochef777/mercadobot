import { Router } from 'express';
import FornecedorController from '../controlers/Fornecedor';

const control = new FornecedorController();
const app = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Fornecedor:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do fornecedor (UUID)
 *         nome:
 *           type: string
 *           description: Nome da empresa ou fornecedor
 *         telefone:
 *           type: string
 *           description: Telefone / WhatsApp do fornecedor
 *         produtos:
 *           type: string
 *           description: "Descrição dos produtos fornecidos (ex: Bebidas, Laticínios, Pães)"
 *         diaVisita:
 *           type: string
 *           description: "Dia da semana em que o fornecedor visita o mercadinho (ex: Segunda, Quarta)"
 *         ultimaEntregaData:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: "Data da última entrega realizada"
 *         ultimaEntregaValor:
 *           type: number
 *           nullable: true
 *           description: "Valor da última entrega"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: "Data de cadastro do fornecedor"
 *     FornecedorInput:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           example: "Distribuidora Ambev"
 *         telefone:
 *           type: string
 *           example: "(81) 99123-4567"
 *         produtos:
 *           type: string
 *           example: "Cervejas, Refrigerantes e Energéticos"
 *         diaVisita:
 *           type: string
 *           example: "Terça-feira"
 *         ultimaEntregaData:
 *           type: string
 *           format: date-time
 *           example: "2026-09-10T10:00:00.000Z"
 *         ultimaEntregaValor:
 *           type: number
 *           example: 1250.00

 */

/**
 * @swagger
 * tags:
 *   name: Fornecedores
 *   description: Gerenciamento de fornecedores, visitas e histórico de entregas do mercadinho
 */

/**
 * @swagger
 * /fornecedor:
 *   post:
 *     summary: Cadastrar um novo fornecedor
 *     tags: [Fornecedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FornecedorInput'
 *     responses:
 *       201:
 *         description: Fornecedor cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fornecedor'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */
app.post('/', control.post);

/**
 * @swagger
 * /fornecedor:
 *   get:
 *     summary: Listar todos os fornecedores
 *     tags: [Fornecedores]
 *     responses:
 *       200:
 *         description: Lista de fornecedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fornecedor'
 *       500:
 *         description: Erro interno
 */
app.get('/', control.get);

/**
 * @swagger
 * /fornecedor/{id}:
 *   get:
 *     summary: Obter detalhes de um fornecedor por ID
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Detalhes do fornecedor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fornecedor'
 *       404:
 *         description: Fornecedor não encontrado
 *       500:
 *         description: Erro interno
 */
app.get('/:id', control.getById);

/**
 * @swagger
 * /fornecedor/{id}:
 *   put:
 *     summary: Atualizar dados de um fornecedor
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FornecedorInput'
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fornecedor'
 *       404:
 *         description: Fornecedor não encontrado
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 */
/**
 * @swagger
 * /fornecedor/{id}:
 *   delete:
 *     summary: Excluir um fornecedor
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor excluído com sucesso
 *       404:
 *         description: Fornecedor não encontrado
 *       500:
 *         description: Erro interno
 */
app.delete('/:id', control.delete);

export default app;
