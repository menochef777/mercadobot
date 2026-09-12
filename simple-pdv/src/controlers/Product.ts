import { PrismaClient } from "@prisma/client";
import Controller from "../controlers/Controler";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
const prisma = new PrismaClient()

class Product implements Controller {

    async getById(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) {
        try {
            const { productId } = req.params
            const product = await prisma.product.findUnique({
                where: {
                    productId: productId
                }
            })
            if (product == null || product == undefined) {
                res.status(404).send('product not find')
            } else {
                res.status(200).json(product)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }

    async getByBarcode(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) {
        try {
            const { barcode } = req.params
            const product = await prisma.product.findFirst({
                where: {
                    barcode: barcode
                }
            })
            if (!product) {
                res.status(404).json({ error: 'Produto não encontrado pelo código de barras' })
            } else {
                res.status(200).json(product)
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Erro ao buscar produto por código de barras' })
        }
    }

    async getByName(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) {
        try {
            const { name } = req.params
            const product = await prisma.product.findFirst({
                where: {
                    name: name
                }
            })
            if (product == null || product == undefined) {
                res.status(404).send('product not find')
            } else {
                res.status(200).json(product)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { productId } = req.params
            const data = await prisma.product.findUnique({
                where: {
                    productId: productId
                }
            })
            if (data == null || data == undefined) {
                res.status(404).json('product not find')
            } else {
                const product = await prisma.product.delete({
                    where: {
                        productId: productId
                    }
                })
                res.status(200).json(product)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }

    async get(req: Request, res: Response): Promise<void> {
        try {
            const data = await prisma.product.findMany()
            if (data.length == 0) {
                res.status(404).json('product not find')
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
            const { productId } = req.params
            const product = await prisma.product.findUnique({
                where: {
                    productId: productId
                }
            })
            if (product == null || product == undefined) {
                res.status(404).send('product not find')
            } else {
                res.status(200).json(product)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }

    async post(req: Request, res: Response): Promise<void> {
        try {
            const {name, barcode, costPrice, description, discount, price, sku, stockQuantity, quantidadeAtual, quantidadeMinima, weight, categoryId, imgURL} = req.body
            const data = await prisma.product.findMany({
                where: {
                    name: name
                }
            })
            if(data.length >= 1){
                res.status(400).send('The product already exist')
            }else{
                const qtdAtual = quantidadeAtual !== undefined ? Number(quantidadeAtual) : (stockQuantity !== undefined ? Number(stockQuantity) : 0);
                const qtdMin = quantidadeMinima !== undefined ? Number(quantidadeMinima) : 0;
                const product = await prisma.product.create({
                    data: {
                        name: name,
                        barcode: barcode,
                        costPrice: costPrice,
                        description: description,
                        discount: discount,
                        price: price,
                        sku: sku,
                        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : qtdAtual,
                        quantidadeAtual: qtdAtual,
                        quantidadeMinima: qtdMin,
                        weight: weight,
                        categoryId: categoryId,
                        imgURL: imgURL
                    }
                })

                res.status(200).json(product)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }
    async put(req: Request, res: Response): Promise<void> {
        try {
            const { productId } = req.params
            const {name, barcode, costPrice, description, discount, price, sku, stockQuantity, quantidadeAtual, quantidadeMinima, weight, categoryId, imgURL} = req.body
            const data = await prisma.product.findMany({
                where: {
                    productId: productId
                }
            })
            if(data.length == 0){
                res.status(400).send('the product dont exist')
            }else{
                const updateData: any = {
                    name: name,
                    barcode: barcode,
                    costPrice: costPrice,
                    description: description,
                    discount: discount,
                    price: price,
                    sku: sku,
                    weight: weight,
                    categoryId: categoryId,
                    imgURL: imgURL
                };
                if (stockQuantity !== undefined) updateData.stockQuantity = Number(stockQuantity);
                if (quantidadeAtual !== undefined) updateData.quantidadeAtual = Number(quantidadeAtual);
                if (quantidadeMinima !== undefined) updateData.quantidadeMinima = Number(quantidadeMinima);

                const product = await prisma.product.update({
                    where: {
                        productId: productId
                    },
                    data: updateData
                })

                res.status(200).json(product)
            }
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }
}

export default Product