/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: Product ID
 *                   name:
 *                     type: string
 *                     description: Product name
 *                   price:
 *                     type: number
 *                     description: Product price
 *       404:
 *         description: No products found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     summary: Retrieve a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /product/name/{name}:
 *   get:
 *     summary: Retrieve a product by name
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The product name
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: "Laptop"
 *               barcode:
 *                 type: string
 *                 description: Product barcode
 *                 example: "1234567890123"
 *               costPrice:
 *                 type: number
 *                 description: Cost price of the product
 *                 example: 500.0
 *               description:
 *                 type: string
 *                 description: Product description
 *                 example: "High-performance laptop"
 *               discount:
 *                 type: number
 *                 description: Discount on the product
 *                 example: 10.0
 *               price:
 *                 type: number
 *                 description: Selling price of the product
 *                 example: 600.0
 *               sku:
 *                 type: string
 *                 description: Stock Keeping Unit
 *                 example: "LAP123"
 *               stockQuantity:
 *                 type: integer
 *                 description: Quantity in stock
 *                 example: 50
 *               weight:
 *                 type: number
 *                 description: Weight of the product
 *                 example: 1.5
 *               categoryId:
 *                 type: string
 *                 description: Category ID of the product
 *                 example: "cat123"
 *               imgURL:
 *                 type: string
 *                 description: Image URL of the product
 *                 example: "/files/product-image.jpg"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Product already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /product/{productId}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /product/{productId}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: "Laptop"
 *               barcode:
 *                 type: string
 *                 description: Product barcode
 *                 example: "1234567890123"
 *               costPrice:
 *                 type: number
 *                 description: Cost price of the product
 *                 example: 500.0
 *               description:
 *                 type: string
 *                 description: Product description
 *                 example: "High-performance laptop"
 *               discount:
 *                 type: number
 *                 description: Discount on the product
 *                 example: 10.0
 *               price:
 *                 type: number
 *                 description: Selling price of the product
 *                 example: 600.0
 *               sku:
 *                 type: string
 *                 description: Stock Keeping Unit
 *                 example: "LAP123"
 *               stockQuantity:
 *                 type: integer
 *                 description: Quantity in stock
 *                 example: 50
 *               weight:
 *                 type: number
 *                 description: Weight of the product
 *                 example: 1.5
 *               categoryId:
 *                 type: string
 *                 description: Category ID of the product
 *                 example: "cat123"
 *               imgURL:
 *                 type: string
 *                 description: Image URL of the product
 *                 example: "/files/product-image.jpg"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Product does not exist
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - barcode
 *         - costPrice
 *         - price
 *         - stockQuantity
 *       properties:
 *         productId:
 *           type: string
 *           description: The unique identifier for the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         barcode:
 *           type: string
 *           description: The barcode of the product
 *         sku:
 *           type: string
 *           description: The Stock Keeping Unit (SKU) of the product
 *         description:
 *           type: string
 *           description: A brief description of the product
 *         costPrice:
 *           type: number
 *           format: float
 *           description: The cost price of the product
 *         price:
 *           type: number
 *           format: float
 *           description: The selling price of the product
 *         discount:
 *           type: number
 *           format: float
 *           description: The discount applied to the product
 *         stockQuantity:
 *           type: integer
 *           description: The quantity of the product in stock
 *         weight:
 *           type: number
 *           format: float
 *           description: The weight of the product
 *         categoryId:
 *           type: string
 *           description: The ID of the category the product belongs to
 *         imgURL:
 *           type: string
 *           description: The URL of the product image
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the product was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the product was last updated
 */

import Product from '../controlers/Product'
import { Router } from 'express'
import { validateBody } from '../midleware/validate'
import { productCreateSchema, productUpdateSchema } from '../schemas'

const control = new Product()

const app = Router()

app.get('/', control.get)
app.get('/barcode/:barcode', control.getByBarcode)
app.get('/:productId', control.getById)
app.get('/name/:name', control.getByName)
app.post('/', validateBody(productCreateSchema), control.post)
app.delete('/:productId', control.delete)
app.put('/:productId', validateBody(productUpdateSchema), control.put)

export default app