import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

class userController {
    generateTokens = (userId: string): { accessToken: string, refreshToken: string } => {
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId }, process.env.REFRESH_JWT_SECRET as string, { expiresIn: '7d' });
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
                res.status(401).send('role Not Exist');
            }

            if (userByCpf || userByName) {
                res.status(401).send('userAlreadExist');
            } else {
                if (email.length < 5 || name.length < 5 || password.length < 8 || cpf.length < 11) {
                    res.status(401).send('Incorrect form');
                } else {
                    var hash = bcrypt.hashSync(password, salt);
                    const user = await prisma.user.create({
                        data: {
                            cpf,
                            data,
                            email,
                            name,
                            password: hash,
                            userName,
                            roleName
                        }
                    });
                    res.status(200).json({
                        userName: user.userName,
                        userId: user.userId
                    });
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }

    getByUserName = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userName } = req.params;
            const user = await prisma.user.findFirst({
                where: { userName }
            });

            if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).json(user);
            }
        } catch (error) {
            res.status(500).send('Error retrieving user');
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
                res.status(401).send('user Not Exist');
            } else if (!email || !name) {
                res.status(401).send('Incorrect form');
            } else {
                const updatedUser = await prisma.user.update({
                    where: { userId },
                    data: {
                        data,
                        email,
                        name,
                        roleName
                    }
                });
                res.status(200).json(updatedUser);
            }
        } catch (error) {
            res.status(500).send('Error updating user');
            console.log(error)
        }
    }

    get = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await prisma.user.findMany();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).send('Error retrieving user');
        }
    }

    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const user = await prisma.user.findUnique({
                where: { userId }
            });
            if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).json(user);
            }
        } catch (error) {
            res.status(500).send('Error retrieving user');
        }
    }

    getByName = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.params;
            const user = await prisma.user.findFirst({
                where: { name }
            });

            if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).json(user);
            }
        } catch (error) {
            res.status(500).send('Error retrieving user');
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            await prisma.user.delete({
                where: { userId }
            });
            res.status(200).send('User deleted successfully');
        } catch (error) {
            res.status(500).send('Error deleting user');
        }
    }

    loginUser = async (req: Request, res: Response) => {
        try {
            const { email, password }: { email: string, password: string } = req.body;

            if (!email || !password) {
                res.status(401).send('Email and password are required');
                return;
            }

            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                res.status(401).send('User not found');
                return;
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                res.status(401).send('Invalid password');
                return;
            }

            const { accessToken, refreshToken } = this.generateTokens(user.userId);

            res.status(200).json({ accessToken, refreshToken });
        } catch (error) {
            console.log(error);
            res.status(500).send('Error logging in user');
        }
    }

    refreshTokens = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.body.refreshToken;

            if (!refreshToken) {
                return res.status(401).send('Refresh token is required');
            }

            jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET as string, (err: any, decoded: { userId: any; }) => {
                if (err) {
                    return res.status(403).send('Invalid refresh token');
                }

                const { userId } = decoded;
                const { accessToken, refreshToken } = this.generateTokens(userId);

                res.status(200).json({ accessToken, refreshToken });
            });
        } catch (error) {
            res.status(500).send('Error refreshing tokens');
        }
    }
}

export default userController;
