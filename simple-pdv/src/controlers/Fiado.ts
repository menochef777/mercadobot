import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

class FiadoController {
  async post(req: Request, res: Response): Promise<void> {
    try {
      const { nomeCliente, telefoneCliente, valor, descricao } = req.body;

      if (!nomeCliente || valor === undefined || valor === null) {
        res.status(400).json({ error: 'nomeCliente e valor são obrigatórios.' });
        return;
      }

      const parsedValor = parseFloat(valor);
      if (isNaN(parsedValor) || parsedValor <= 0) {
        res.status(400).json({ error: 'valor deve ser um número positivo.' });
        return;
      }

      const fiado = await prisma.fiado.create({
        data: {
          nomeCliente,
          telefoneCliente: telefoneCliente || null,
          valor: parsedValor,
          descricao: descricao || null,
          status: 'PENDENTE',
        },
      });

      res.status(201).json(fiado);
    } catch (error) {
      console.error('Erro ao criar fiado:', error);
      res.status(500).json({ error: 'Erro interno ao registrar fiado.' });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.query;
      const where: any = {};
      if (status && typeof status === 'string') {
        where.status = status.toUpperCase();
      }

      const fiados = await prisma.fiado.findMany({
        where,
        orderBy: {
          dataCriacao: 'desc',
        },
      });

      res.status(200).json(fiados);
    } catch (error) {
      console.error('Erro ao listar fiados:', error);
      res.status(500).json({ error: 'Erro interno ao listar fiados.' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const fiado = await prisma.fiado.findUnique({
        where: { id },
      });

      if (!fiado) {
        res.status(404).json({ error: 'Registro de fiado não encontrado.' });
        return;
      }

      res.status(200).json(fiado);
    } catch (error) {
      console.error('Erro ao buscar fiado:', error);
      res.status(500).json({ error: 'Erro interno ao buscar fiado.' });
    }
  }

  async pagar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const fiadoExist = await prisma.fiado.findUnique({
        where: { id },
      });

      if (!fiadoExist) {
        res.status(404).json({ error: 'Registro de fiado não encontrado.' });
        return;
      }

      if (fiadoExist.status === 'PAGO') {
        res.status(400).json({
          message: 'Este fiado já foi marcado como PAGO.',
          fiado: fiadoExist,
        });
        return;
      }

      const fiadoAtualizado = await prisma.fiado.update({
        where: { id },
        data: {
          status: 'PAGO',
          dataPagamento: new Date(),
        },
      });

      res.status(200).json({
        message: 'Fiado quitado com sucesso!',
        fiado: fiadoAtualizado,
      });
    } catch (error) {
      console.error('Erro ao marcar fiado como pago:', error);
      res.status(500).json({ error: 'Erro interno ao atualizar fiado.' });
    }
  }
}

export default FiadoController;
