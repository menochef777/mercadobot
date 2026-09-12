import { Request, Response } from "express";
import Controller from "../Controler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

class rolePermissions implements Controller {
    async post(req: Request, res: Response): Promise<void> {
        try {
            const data = await prisma.rolePermission.create({
                data: {
                    permissionId: req.body.permissionId,
                    roleId: req.body.roleId
                }
            })
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async get(req: Request, res: Response): Promise<void> {
        try {
            const data = await prisma.rolePermission.findMany()
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const data = await prisma.rolePermission.delete({
                where: {
                    roleId_permissionId: {
                        roleId: req.body.roleId,
                        permissionId: req.body.permissionId
                    }
                }
            })
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const data = await prisma.rolePermission.findFirst({
                where: {
                    roleId: req.params.roleId,
                    permissionId: req.body.permissionId
                }
            })
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async getByName(req: Request, res: Response): Promise<void> {
        try {
            const data = await prisma.rolePermission.findFirst({
                where: {
                    roleId: req.body.roleId,
                    permissionId: req.body.permissionId
                }
            })
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async put(req: Request, res: Response): Promise<void> {
        try {
            const data = await prisma.rolePermission.update({
                data: {
                    roleId: req.body.roleId,
                    permissionId: req.body.permissionId
                },
                where: {
                    roleId_permissionId: {
                        roleId: req.body.roleId,
                        permissionId: req.body.permissionId
                    }
                }
            })
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

export default rolePermissions