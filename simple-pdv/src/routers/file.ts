import multer from 'multer';
import path from 'path';
import { Router, Request, Response } from 'express';
import { uploadLimiter } from '../midleware/rateLimit';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
];

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve('files'));
  },
  filename: (req, file, callback) => {
    const time = new Date().getTime();
    // Sanitiza o nome original removendo caracteres de path traversal e caracteres especiais
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    callback(null, `${time}_${sanitizedName}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Tipo de arquivo não permitido. Apenas imagens, áudios e PDFs são aceitos.'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  },
  fileFilter,
});

const route = Router();

route.post('/upload', uploadLimiter, (req: Request, res: Response, next) => {
  upload.single('file')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Arquivo muito grande. O tamanho máximo permitido é 10MB.' });
      }
      return res.status(400).json({ error: `Erro no upload: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    return res.status(201).json({
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });
});

export default route;
