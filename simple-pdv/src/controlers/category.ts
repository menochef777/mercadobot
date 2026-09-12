import { PrismaClient } from '@prisma/client'
import { Request, Response } from "express"
const prisma = new PrismaClient()

import Controler from './Controler'

class Category implements Controler {

    async get(req: Request, res: Response) {
        try {
            const data = await prisma.category.findMany()
            res.json(data).status(200)
        } catch (error) {
            res.send(error)
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { categoryId } = req.params
            const category = await prisma.category.findMany({
                where: {
                    categoryId: categoryId
                }
            })
            if (category.length == 0) {
                res.status(400).send('The category dont exist')
            } else {
                res.json(category[0]).status(200)
            }
        } catch (error) {
            res.send(error)
        }
    }

    async getByName(req: Request, res: Response) {
        try {
            const { name } = req.params
            const category = await prisma.category.findMany({
                where: {
                    name: name
                }
            })
            if (category.length == 0) {
                res.status(400).send('The category dont exist')
            } else {
                res.json(category[0]).status(200)
            }
        } catch (error) {
            res.send(error)
        }
    }

    async post(req: Request, res: Response) {
        try {
            const { name, parentId } = req.body
            if(parentId){
                const parentExist = await prisma.category.findUnique({
                    where: {
                        categoryId: parentId
                    }
                })

                if(!parentExist){
                    res.status(404).send('The category parent dont exist')
                }
            }
            const categoryExist = await prisma.category.findMany({
                where: {
                    name: name
                }
            })
            if (categoryExist.length >= 1) {
                res.status(400).send('The category alred exist')
            } else {
                const data = await prisma.category.create({
                    data: {
                        name: name,
                        parentId: parentId
                    }
                })
                res.send(data).status(200)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async put(req: Request, res: Response) {
        try {
            const { categoryId } = req.params
            const { name, parentId } = req.body
            const categoryExist = await prisma.category.findMany({
                where: {
                    categoryId: categoryId
                }
            })
            if (categoryExist.length == 0) {
                res.status(400).send('The category not exist')
            } else {
                const data = await prisma.category.update({
                    where: {
                        categoryId: categoryId
                    },
                    data: {
                        name: name,
                        parentId: parentId
                    }
                })
                res.json(data).status(200)
            }
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const { categoryId } = req.params
            const categoryExist = await prisma.category.findUnique({
                where: {
                    categoryId: categoryId
                }
            })
            if (!categoryExist) {
                res.status(400).send('The category not exist')
            } else {
                const data = await prisma.category.delete({
                    where: {
                        categoryId: categoryId
                    }
                })
                res.json(data).status(200)
            }
        } catch (error) {
            res.send(error)
        }
    }
}

export default Category