import rateLimit from 'express-rate-limit';

// Rate limiter para endpoints de autenticação e login (previne brute force e credential stuffing)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 tentativas por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Muitas tentativas de autenticação a partir deste IP. Tente novamente após 15 minutos.',
  },
});

// Rate limiter global para APIs da aplicação
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // máximo 500 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Limite de requisições excedido. Reduza a frequência de chamadas.',
  },
});

// Rate limiter para uploads de arquivo
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // máximo 30 uploads a cada 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Limite de upload de arquivos excedido.',
  },
});
