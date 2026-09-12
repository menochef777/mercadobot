import { Request, Response } from "express";
import Controller from "../Controler"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

class Permission implements Controller {

    async post(req: Request, res: Response): Promise<void> {
        try {
            const permission = await prisma.permission.create({
                data: {
                    name: req.body.name,
                }
            })
            res.status(200).json(permission)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }

    async put(req: Request, res: Response): Promise<void> {
        try {
            const permission = await prisma.permission.update({
                data: {
                    name: req.body.name
                }, 
                where: {
                    id: req.params.id
                }
            })
            res.status(200).json(permission)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const permission = await prisma.permission.delete({
                where: {
                    id: req.params.id
                }
            })
            res.status(200).json(permission)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
    async get(req: Request, res: Response): Promise<void> {
        try {
            const permissions = await prisma.permission.findMany()
            res.status(200).json(permissions)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const permission = await prisma.permission.findFirst({
                where: {
                    id: req.params.id
                }
            })
            res.status(200).json(permission)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
    async getByName(req: Request, res: Response): Promise<void> {
        try {
            const permission = await prisma.permission.findFirst({
                where: {
                    id: req.params.name
                }
            })
            res.status(200).json(permission)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}

export default Permission