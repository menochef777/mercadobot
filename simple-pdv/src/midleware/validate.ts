import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.issues) {
        const issues = (error as ZodError).issues || [];
        res.status(400).json({
          error: 'Dados de entrada inválidos',
          details: issues.map((e: any) => ({
            field: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
            message: e.message,
          })),
        });
        return;
      }
      res.status(400).json({ error: 'Erro de validação dos dados enviados.' });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.query);
      req.query = parsed as any;
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.issues) {
        const issues = (error as ZodError).issues || [];
        res.status(400).json({
          error: 'Parâmetros de busca inválidos',
          details: issues.map((e: any) => ({
            field: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
            message: e.message,
          })),
        });
        return;
      }
      res.status(400).json({ error: 'Erro de validação dos parâmetros de query.' });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.params);
      req.params = parsed as any;
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.issues) {
        const issues = (error as ZodError).issues || [];
        res.status(400).json({
          error: 'Parâmetros de rota inválidos',
          details: issues.map((e: any) => ({
            field: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
            message: e.message,
          })),
        });
        return;
      }
      res.status(400).json({ error: 'Erro de validação dos parâmetros de rota.' });
    }
  };
};
