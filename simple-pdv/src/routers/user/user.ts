/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and login
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: "password123"
 *               userName:
 *                 type: string
 *                 description: User's username
 *                 example: "johndoe"
 *               cpf:
 *                 type: string
 *                 description: User's CPF
 *                 example: "12345678901"
 *               roleName:
 *                 type: string
 *                 description: Role name (Admin, Gerente, Vendedor)
 *                 example: "Admin"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid role name
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     description: User ID
 *                   name:
 *                     type: string
 *                     description: User's full name
 *                   email:
 *                     type: string
 *                     description: User's email
 *                   userName:
 *                     type: string
 *                     description: User's username
 */

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 userName:
 *                   type: string
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/name/{name}:
 *   get:
 *     summary: Get user by name
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The user name
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 userName:
 *                   type: string
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/username/{userName}:
 *   get:
 *     summary: Get user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userName
 *         schema:
 *           type: string
 *         required: true
 *         description: The username
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 userName:
 *                   type: string
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/{userId}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: "user@example.com"
 *               roleId:
 *                 type: integer
 *                 description: Role ID assigned to the user
 *                 example: 1
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */


import { Router } from "express";
import userController from "../../controlers/User/User";
import authenticateToken from "../../midleware/authorizate";
const app = Router()
const user = new userController()


app.post('/', authenticateToken('CREATE_USER'), user.post)
app.get('/', user.get)
app.get('/:userId', user.getById)
app.get('/name/:name', user.getByName)
app.get('/username/:userName', user.getByUserName)
app.delete('/:userId', authenticateToken('DELETE_USER'), user.delete)
app.put('/:userId', authenticateToken('UPDATE_USER'), user.put)



export default app


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - userName
 *         - cpf
 *         - roleName
 *       properties:
 *         userId:
 *           type: string
 *           description: The unique identifier for the user
 *         name:
 *           type: string
 *           description: The full name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password for the user
 *         userName:
 *           type: string
 *           description: The username for the user
 *         cpf:
 *           type: string
 *           description: The CPF (Cadastro de Pessoa Física) of the user
 *         roleName:
 *           type: string
 *           description: The role assigned to the user (e.g., Admin, Gerente, Vendedor)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was last updated
 */