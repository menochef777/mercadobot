import { Request, Response } from "express";
import Controller from "../Controler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

class Role implements Controller {

    async post(req: Request, res: Response): Promise<void> {
        try {
            const role = await prisma.role.create({
                data: {
                    name: req.body.name,
                }
            })
            res.status(200).json(role)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const role = await prisma.role.delete({
                where: {
                    id: req.params.id
                }
            })
            res.status(200).json(role)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }

    async get(req: Request, res: Response): Promise<void> {
        try {
            const role = await prisma.role.findMany()
            res.status(200).json(role)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const role = await prisma.role.findFirst({
                where: {
                    id: req.params.id
                }
            })
            res.status(200).json(role)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
    async getByName(req: Request, res: Response): Promise<void> {
        try {
            const role = await prisma.role.findFirst({
                where: {
                    name: req.params.name
                }
            })
            res.status(200).json(role)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
    async put(req: Request, res: Response): Promise<void> {
        try {
            const role = await prisma.role.update({
                data: {
                    name: req.body.name
                },
                where: {
                    id: req.params.id
                }
            })
            res.status(200).json(role)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}

export default Role