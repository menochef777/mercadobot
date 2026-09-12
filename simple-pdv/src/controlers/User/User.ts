import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const getJwtSecret = () => process.env.JWT_SECRET || 'default_production_secure_key_gestormercado_2026';
const getRefreshJwtSecret = () => process.env.REFRESH_JWT_SECRET || 'default_production_refresh_key_gestormercado_2026';

const userSelectFields = {
    userId: true,
    name: true,
    userName: true,
    email: true,
    cpf: true,
    data: true,
    roleName: true,
    createdAt: true,
    updatedAt: true,
};

class userController {
    generateTokens = (userId: string): { accessToken: string, refreshToken: string } => {
        const accessToken = jwt.sign({ userId }, getJwtSecret(), { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId }, getRefreshJwtSecret(), { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }

    post = async (req: Request, res: Response): Promise<void> => {
        try {
            const salt = bcrypt.genSaltSync(10);
            const { cpf, data, email, name, password, userName, roleName } = req.body;
            
            const userByName = await prisma.user.findUnique({
                where: { userName }
            });
            const userByCpf = await prisma.user.findUnique({
                where: { cpf }
            });

            const role = await prisma.role.findUnique({ where: { name: roleName } });
            if (!role) {
                res.status(400).json({ error: 'Role informada não existe.' });
                return;
            }

            if (userByCpf || userByName) {
                res.status(409).json({ error: 'Usuário com este nome de usuário ou CPF já cadastrado.' });
                return;
            }

            const hash = bcrypt.hashSync(password, salt);
            const user = await prisma.user.create({
                data: {
                    cpf,
                    data,
                    email,
                    name,
                    password: hash,
                    userName,
                    roleName
                },
                select: userSelectFields
            });

            res.status(201).json(user);
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ error: 'Erro interno ao criar usuário.' });
        }
    }

    getByUserName = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userName } = req.params;
            const user = await prisma.user.findFirst({
                where: { userName },
                select: userSelectFields
            });

            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado.' });
            } else {
                res.status(200).json(user);
            }
        } catch (error) {
            console.error('Erro ao buscar usuário por username:', error);
            res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }
    }

    put = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const { data, email, name, roleName } = req.body;
            const user = await prisma.user.findUnique({
                where: { userId }
            });

            if (!user) {
                res.status(404).json({ error: 'Usuário não existe.' });
                return;
            }

            if (roleName) {
                const role = await prisma.role.findUnique({ where: { name: roleName } });
                if (!role) {
                    res.status(400).json({ error: 'Role informada não existe.' });
                    return;
                }
            }

            const updatedUser = await prisma.user.update({
                where: { userId },
                data: {
                    ...(data !== undefined && { data }),
                    ...(email !== undefined && { email }),
                    ...(name !== undefined && { name }),
                    ...(roleName !== undefined && { roleName }),
                },
                select: userSelectFields
            });

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro ao atualizar usuário.' });
        }
    }

    get = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await prisma.user.findMany({
                select: userSelectFields
            });
            res.status(200).json(users);
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({ error: 'Erro ao listar usuários.' });
        }
    }

    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const user = await prisma.user.findUnique({
                where: { userId },
                select: userSelectFields
            });
            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado.' });
            } else {
                res.status(200).json(user);
            }
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }
    }

    getByName = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.params;
            const user = await prisma.user.findFirst({
                where: { name },
                select: userSelectFields
            });

            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado.' });
            } else {
                res.status(200).json(user);
            }
        } catch (error) {
            console.error('Erro ao buscar usuário por nome:', error);
            res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const user = await prisma.user.findUnique({ where: { userId } });
            if (!user) {
                res.status(404).json({ error: 'Usuário não encontrado.' });
                return;
            }
            await prisma.user.delete({
                where: { userId }
            });
            res.status(200).json({ message: 'Usuário excluído com sucesso.' });
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).json({ error: 'Erro ao excluir usuário.' });
        }
    }

    loginUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password }: { email: string, password: string } = req.body;

            if (!email || !password) {
                res.status(400).json({ error: 'Email e senha são obrigatórios.' });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                res.status(401).json({ error: 'Credenciais inválidas.' });
                return;
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                res.status(401).json({ error: 'Credenciais inválidas.' });
                return;
            }

            const { accessToken, refreshToken } = this.generateTokens(user.userId);

            res.status(200).json({
                accessToken,
                refreshToken,
                user: {
                    userId: user.userId,
                    name: user.name,
                    email: user.email,
                    userName: user.userName,
                    roleName: user.roleName
                }
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro interno ao realizar autenticação.' });
        }
    }

    refreshTokens = async (req: Request, res: Response): Promise<void> => {
        try {
            const refreshToken = req.body.refreshToken;

            if (!refreshToken) {
                res.status(400).json({ error: 'Token de atualização é obrigatório.' });
                return;
            }

            jwt.verify(refreshToken, getRefreshJwtSecret(), (err: any, decoded: any) => {
                if (err) {
                    return res.status(403).json({ error: 'Token de atualização inválido ou expirado.' });
                }

                const { userId } = decoded;
                const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(userId);

                res.status(200).json({ accessToken, refreshToken: newRefreshToken });
            });
        } catch (error) {
            console.error('Erro ao renovar token:', error);
            res.status(500).json({ error: 'Erro interno ao renovar token.' });
        }
    }
}

export default userController;
