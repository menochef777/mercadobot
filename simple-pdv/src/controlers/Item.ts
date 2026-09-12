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

import { PrismaClient } from "@prisma/client";
import Controller from "../controlers/Controler";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
const prisma = new PrismaClient()

class Item implements Controller {
    async getByOrder(req: Request, res: Response) {
        try {
            const { orderId } = req.params;
            const order = await prisma.order.findUnique({
                where: {
                    orderId: orderId
                }
            });
    
            if (!order) {
                res.status(404).send('Order doesn\'t exist');
            } else {
                const items = await prisma.item.findMany({
                    where: {
                        orderId: orderId
                    }
                });
    
                const completeOrder = await Promise.all(items.map(async (item) => {
                    if (item.productId) {
                        const product = await prisma.product.findUnique({
                            where: {
                                productId: item.productId
                            }
                        });
                        return {
                            quantity: item.quantity,
                            name: product?.name,
                            price: product?.price,
                            barcode: product?.sku,
                            discount: product?.discount
                        };
                    }
                }));
    
                res.status(200).json(completeOrder.filter(item => item !== undefined));
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    async getById(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) {
        try {
            const { itemId } = req.params
            const item = await prisma.item.findUnique({
                where: {
                    itemId: itemId
                }
            })
            if (item == null || item == undefined) {
                res.status(404).send('item not find')
            } else {
                res.status(200).json(item)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }

    async getByName(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) {
        try {
            const { itemId } = req.params
            const item = await prisma.item.findFirst({
                where: {
                    itemId: itemId
                }
            })
            if (item == null || item == undefined) {
                res.status(404).send('item not find')
            } else {
                res.status(200).json(item)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { itemId } = req.params
            const data = await prisma.item.findUnique({
                where: {
                    itemId: itemId
                }
            })
            if (data == null || data == undefined) {
                res.status(404).json('item not find')
            } else {
                const item = await prisma.item.delete({
                    where: {
                        itemId: itemId
                    }
                })
                res.status(200).json(item)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }

    async get(req: Request, res: Response): Promise<void> {
        try {
            const data = await prisma.item.findMany()
            if (data.length == 0) {
                res.status(404).json('item not find')
            } else {
                res.status(200).json(data)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }

    async getUnique(req: Request, res: Response): Promise<void> {
        try {
            const { itemId } = req.params
            const item = await prisma.item.findUnique({
                where: {
                    itemId: itemId
                }
            })
            if (item == null || item == undefined) {
                res.status(404).send('item not find')
            } else {
                res.status(200).json(item)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }

    async post(req: Request, res: Response): Promise<void> {
        try {
            const { orderId, productId, quantity } = req.body
            const item = await prisma.item.create({
                data: {
                    orderId: orderId,
                    productId: productId,
                    quantity: quantity
                }
            })
            res.status(200).json(item)
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }

    async put(req: Request, res: Response): Promise<void> {
        try {
            const { itemId } = req.params
            const {orderId, productId, quantity} = req.body
            const data = await prisma.item.findMany({
                where: {
                    itemId: itemId
                }
            })
            if(data.length == 0){
                res.status(400).send('the item dont exist')
            }else{
                const item = await prisma.item.update({
                    where: {
                        itemId: itemId
                    },
                    data: {
                        orderId: orderId,
                        productId: productId,
                        quantity: quantity
                    }
                })

                res.status(200).json(item)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }
}

export default Item