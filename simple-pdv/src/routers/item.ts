/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - orderId
 *         - productId
 *         - quantity
 *       properties:
 *         itemId:
 *           type: string
 *           description: The unique identifier for the item
 *         orderId:
 *           type: string
 *           description: The ID of the order associated with the item
 *         productId:
 *           type: string
 *           description: The ID of the product associated with the item
 *         quantity:
 *           type: integer
 *           description: The quantity of the product in the order
 */

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: API for managing items in orders
 */

/**
 * @swagger
 * /item:
 *   get:
 *     summary: Retrieve a list of items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       404:
 *         description: No items found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /item/{itemId}:
 *   get:
 *     summary: Retrieve an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID
 *     responses:
 *       200:
 *         description: An item object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /item/order/{orderId}:
 *   get:
 *     summary: Retrieve items by order ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: A list of items in the order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /item:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /item/{itemId}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /item/{itemId}:
 *   put:
 *     summary: Update an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */


import Item from '../controlers/Item'
import { Router } from 'express'

const control = new Item()

const app = Router()

app.get('/', control.get)
app.get('/:itemId', control.getById)
app.get('/order/:orderId', control.getByOrder)
app.post('/', control.post)
app.delete('/:itemId', control.delete)
app.put('/:itemId', control.put)

export default app