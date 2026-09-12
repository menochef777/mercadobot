import { Request, Response } from "express"

import { PrismaClient } from "@prisma/client";


interface Controller {
    get (req: Request, res: Response): void
    post(req: Request, res: Response): void
    put(req: Request, res: Response): void
    delete(req: Request, res: Response): void
    getById(req: Request, res: Response): void
    getByName(req: Request, res: Response): void
}

export default Controller