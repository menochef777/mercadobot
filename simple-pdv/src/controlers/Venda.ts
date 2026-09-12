import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

class VendaController {
  async post(req: Request, res: Response): Promise<void> {
    try {
      const { valor, formaPagamento, cliente, itens } = req.body;

      if (valor === undefined || valor === null || valor === '') {
        res.status(400).json({ error: 'O campo valor é obrigatório.' });
        return;
      }

      const parsedValor = parseFloat(valor);
      if (isNaN(parsedValor) || parsedValor <= 0) {
        res.status(400).json({ error: 'O valor da venda deve ser um número positivo.' });
        return;
      }

      const venda = await prisma.venda.create({
        data: {
          valor: parsedValor,
          formaPagamento: formaPagamento || 'Dinheiro',
          cliente: cliente || null,
          itens: itens || null,
        },
      });

      res.status(201).json(venda);
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      res.status(500).json({ error: 'Erro interno ao registrar venda.' });
    }
  }

  async getHoje(req: Request, res: Response): Promise<void> {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const vendas = await prisma.venda.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const total = vendas.reduce((acc, v) => acc + v.valor, 0);

      res.status(200).json({
        total,
        count: vendas.length,
        vendas,
      });
    } catch (error) {
      console.error('Erro ao buscar vendas de hoje:', error);
      res.status(500).json({ error: 'Erro interno ao buscar vendas de hoje.' });
    }
  }
}

export default VendaController;
