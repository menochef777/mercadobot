import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface RequestAuth extends Request {
    user?: string | jwt.JwtPayload
}

const authenticateToken = (req: RequestAuth, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).send('Token is required')

    const JWT_SECRET = process.env.JWT_SECRET || '3f8b9c2a4d6e7f1a2b3c4d5e6f7g8h9i';
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token')
        req.body.user = user
        next()
    })
}

export default authenticateToken