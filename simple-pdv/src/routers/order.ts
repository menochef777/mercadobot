/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - date
 *         - status
 *         - paypamentMethod
 *       properties:
 *         orderId:
 *           type: string
 *           description: The unique identifier for the order
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date the order was created
 *         status:
 *           type: string
 *           description: The status of the order
 *           example: "await payment"
 *         paypamentMethod:
 *           type: string
 *           description: The payment method used for the order
 *           example: "credit card"
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Retrieve a list of orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: No orders found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /order/{orderId}:
 *   get:
 *     summary: Retrieve an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: An order object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date the order was created
 *               status:
 *                 type: string
 *                 description: The status of the order
 *                 example: "await payment"
 *               paypamentMethod:
 *                 type: string
 *                 description: The payment method used for the order
 *                 example: "credit card"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /order/{orderId}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /order/{orderId}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date the order was created
 *               status:
 *                 type: string
 *                 description: The status of the order
 *                 example: "await payment"
 *               paypamentMethod:
 *                 type: string
 *                 description: The payment method used for the order
 *                 example: "credit card"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */


import Order from '../controlers/Order'
import { Router } from 'express'

const control = new Order()

const app = Router()

app.get('/', control.get)
app.get('/full', control.getFullOrders)
app.get('/:orderId', control.getById)
app.get('/name/:orderId', control.getByName)
app.post('/', control.post)
app.delete('/:orderId', control.delete)
app.put('/:orderId', control.put)

export default app