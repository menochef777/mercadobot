import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

interface RequestAuth extends Request {
    user?: { userId: string }; // Define o tipo do usuário no request
}

const authenticateToken = (permission: string) => {
    return async (req: RequestAuth, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).send('Token is required');

        jwt.verify(token, process.env.JWT_SECRET as string, async (err, decoded) => {
            if (err) return res.status(403).send('Invalid token');

            // Decodifica o token e obtém o userId
            const payload = decoded as { userId: string };
            const userId = payload.userId;

            // Busca o usuário no banco de dados
            const user = await prisma.user.findUnique({
                where: { userId },
                include: { Role: { include: { permissions: { include: { Permission: true } } } } },
            });

            if (!user) return res.status(404).send('User not found');

            // Verifica se o usuário tem a permissão necessária
            const hasPermission = user.Role?.permissions.some((rp) => rp.Permission.name === permission);
            if (!hasPermission) return res.status(403).send('Permission denied');

            // Adiciona o usuário ao req para uso posterior
            req.user = { userId };

            next();
        });
    };
};

export default authenticateToken;