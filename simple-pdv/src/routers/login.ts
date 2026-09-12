/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and token management
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a user and generate access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The access token
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token
 *       401:
 *         description: Invalid credentials or missing fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /login/refresh:
 *   post:
 *     summary: Refresh access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token
 *                 refreshToken:
 *                   type: string
 *                   description: The new refresh token
 *       401:
 *         description: Missing or invalid refresh token
 *       403:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
import { Router, Request, Response } from "express";
import userController from "../controlers/User/User"

const app = Router()
const controler = new userController()

app.post('/', controler.loginUser)
app.post('/refresh', controler.refreshTokens)
  

export default app