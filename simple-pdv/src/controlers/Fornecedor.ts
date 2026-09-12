import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

class FornecedorController {
  async post(req: Request, res: Response): Promise<void> {
    try {
      const { nome, telefone, produtos, diaVisita, ultimaEntregaData, ultimaEntregaValor } = req.body;

      if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        res.status(400).json({ error: 'O campo nome é obrigatório.' });
        return;
      }

      let parsedValor: number | null = null;
      if (ultimaEntregaValor !== undefined && ultimaEntregaValor !== null && ultimaEntregaValor !== '') {
        parsedValor = parseFloat(ultimaEntregaValor);
        if (isNaN(parsedValor)) {
          res.status(400).json({ error: 'ultimaEntregaValor deve ser um número válido.' });
          return;
        }
      }

      let parsedData: Date | null = null;
      if (ultimaEntregaData) {
        parsedData = new Date(ultimaEntregaData);
        if (isNaN(parsedData.getTime())) {
          res.status(400).json({ error: 'ultimaEntregaData deve ser uma data válida.' });
          return;
        }
      }

      const fornecedor = await prisma.fornecedor.create({
        data: {
          nome: nome.trim(),
          telefone: telefone || null,
          produtos: produtos || null,
          diaVisita: diaVisita || null,
          ultimaEntregaData: parsedData,
          ultimaEntregaValor: parsedValor,
        },
      });

      res.status(201).json(fornecedor);
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      res.status(500).json({ error: 'Erro interno ao cadastrar fornecedor.' });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const fornecedores = await prisma.fornecedor.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json(fornecedores);
    } catch (error) {
      console.error('Erro ao listar fornecedores:', error);
      res.status(500).json({ error: 'Erro interno ao listar fornecedores.' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const fornecedor = await prisma.fornecedor.findUnique({
        where: { id },
      });

      if (!fornecedor) {
        res.status(404).json({ error: 'Fornecedor não encontrado.' });
        return;
      }

      res.status(200).json(fornecedor);
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error);
      res.status(500).json({ error: 'Erro interno ao buscar fornecedor.' });
    }
  }

  async put(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, telefone, produtos, diaVisita, ultimaEntregaData, ultimaEntregaValor } = req.body;

      const fornecedorExist = await prisma.fornecedor.findUnique({
        where: { id },
      });

      if (!fornecedorExist) {
        res.status(404).json({ error: 'Fornecedor não encontrado.' });
        return;
      }

      const updateData: any = {};
      if (nome !== undefined) updateData.nome = nome.trim();
      if (telefone !== undefined) updateData.telefone = telefone;
      if (produtos !== undefined) updateData.produtos = produtos;
      if (diaVisita !== undefined) updateData.diaVisita = diaVisita;

      if (ultimaEntregaValor !== undefined) {
        if (ultimaEntregaValor === null || ultimaEntregaValor === '') {
          updateData.ultimaEntregaValor = null;
        } else {
          const parsedValor = parseFloat(ultimaEntregaValor);
          if (isNaN(parsedValor)) {
            res.status(400).json({ error: 'ultimaEntregaValor deve ser um número válido.' });
            return;
          }
          updateData.ultimaEntregaValor = parsedValor;
        }
      }

      if (ultimaEntregaData !== undefined) {
        if (ultimaEntregaData === null || ultimaEntregaData === '') {
          updateData.ultimaEntregaData = null;
        } else {
          const parsedData = new Date(ultimaEntregaData);
          if (isNaN(parsedData.getTime())) {
            res.status(400).json({ error: 'ultimaEntregaData deve ser uma data válida.' });
            return;
          }
          updateData.ultimaEntregaData = parsedData;
        }
      }

      const fornecedorAtualizado = await prisma.fornecedor.update({
        where: { id },
        data: updateData,
      });

      res.status(200).json(fornecedorAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      res.status(500).json({ error: 'Erro interno ao atualizar fornecedor.' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const fornecedorExist = await prisma.fornecedor.findUnique({
        where: { id },
      });

      if (!fornecedorExist) {
        res.status(404).json({ error: 'Fornecedor não encontrado.' });
        return;
      }

      await prisma.fornecedor.delete({
        where: { id },
      });

      res.status(200).json({ message: 'Fornecedor excluído com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      res.status(500).json({ error: 'Erro interno ao excluir fornecedor.' });
    }
  }
}

export default FornecedorController;
