import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

const getJwtSecret = (): string => {
    return process.env.JWT_SECRET || 'default_production_secure_key_gestormercado_2026';
};

export interface AuthenticatedRequest extends Request {
    user?: { userId: string };
}

const authorizePermission = (permission: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

            if (!token) {
                res.status(401).json({ error: 'Token de autenticação é obrigatório.' });
                return;
            }

            jwt.verify(token, getJwtSecret(), async (err, decoded) => {
                if (err) {
                    res.status(403).json({ error: 'Token inválido ou expirado.' });
                    return;
                }

                try {
                    const payload = decoded as { userId: string };
                    const userId = payload?.userId;

                    if (!userId) {
                        res.status(403).json({ error: 'Token com estrutura inválida.' });
                        return;
                    }

                    const user = await prisma.user.findUnique({
                        where: { userId },
                        include: { Role: { include: { permissions: { include: { Permission: true } } } } },
                    });

                    if (!user) {
                        res.status(404).json({ error: 'Usuário não encontrado.' });
                        return;
                    }

                    // Se a role for Admin, concede acesso irrestrito
                    if (user.roleName === 'Admin') {
                        req.user = { userId };
                        next();
                        return;
                    }

                    const hasPermission = user.Role?.permissions.some((rp) => rp.Permission.name === permission);
                    if (!hasPermission) {
                        res.status(403).json({ error: `Acesso negado. Permissão necessária: ${permission}` });
                        return;
                    }

                    req.user = { userId };
                    next();
                } catch (dbErr) {
                    console.error('Erro na validação de permissão:', dbErr);
                    res.status(500).json({ error: 'Erro interno ao validar autorização.' });
                }
            });
        } catch (error) {
            console.error('Erro no middleware de autorização:', error);
            res.status(500).json({ error: 'Erro interno no middleware de autorização.' });
        }
    };
};

export default authorizePermission;