/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       required:
 *         - fileName
 *         - filePath
 *       properties:
 *         fileId:
 *           type: string
 *           description: The unique identifier for the file
 *         fileName:
 *           type: string
 *           description: The name of the file
 *         filePath:
 *           type: string
 *           description: The path where the file is stored
 *         fileType:
 *           type: string
 *           description: The type of the file (e.g., image, document)
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the file was uploaded
 */

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: API for managing file uploads and retrievals
 */

/**
 * @swagger
 * /file:
 *   get:
 *     summary: Retrieve a list of files
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: A list of files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 *       404:
 *         description: No files found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /file/{fileId}:
 *   get:
 *     summary: Retrieve a file by ID
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: string
 *         required: true
 *         description: The file ID
 *     responses:
 *       200:
 *         description: A file object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/File'
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a new file
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /file/{fileId}:
 *   delete:
 *     summary: Delete a file by ID
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         schema:
 *           type: string
 *         required: true
 *         description: The file ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */

import multer from 'multer'
import path from 'path'

import { Router } from 'express'

const storeage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.resolve('files'))
    },
    filename: (req, file, callback)=> {
        const time = new Date().getTime()
        callback(null, `${time}_${file.originalname}`)
    }
})

const upload = multer({ storage: storeage })
const route = Router()

route.post('/upload', upload.single('file'), (req, res) => {
    return res.json(req.file?.filename)
})


export default route
