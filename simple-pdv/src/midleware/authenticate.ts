import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('⚠️ [Segurança] JWT_SECRET não foi definido no ambiente. Usando segredo temporário.');
    return 'default_production_secure_key_gestormercado_2026';
  }
  return secret;
};

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    return;
  }

  const secret = getJwtSecret();
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Token inválido ou expirado.' });
      return;
    }
    req.user = decoded;
    next();
  });
};

export default authenticateToken;