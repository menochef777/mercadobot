import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

class EstoqueController {
  async getAlertas(req: Request, res: Response): Promise<void> {
    try {
      const produtos = await prisma.product.findMany({
        include: {
          categoryId: true,
        },
      });

      // Retorna todos os produtos onde quantidadeAtual <= quantidadeMinima, ordenados pelo mais crítico primeiro
      const produtosEmAlerta = produtos
        .filter((produto) => (produto.quantidadeAtual ?? 0) <= (produto.quantidadeMinima ?? 0))
        .map((produto) => {
          const qtdAtual = produto.quantidadeAtual ?? 0;
          const qtdMin = produto.quantidadeMinima ?? 5;
          const deficit = Math.max(0, qtdMin - qtdAtual);
          return {
            ...produto,
            statusEstoque: qtdAtual === 0 ? 'ESGOTADO' : 'ESTOQUE_BAIXO',
            deficit,
          };
        })
        .sort((a, b) => {
          // Mais crítico primeiro: maior déficit, depois menor quantidade atual
          if (b.deficit !== a.deficit) {
            return b.deficit - a.deficit;
          }
          return (a.quantidadeAtual ?? 0) - (b.quantidadeAtual ?? 0);
        });

      res.status(200).json(produtosEmAlerta);
    } catch (error) {
      console.error('Erro ao consultar alertas de estoque:', error);
      res.status(500).json({ error: 'Erro interno ao consultar alertas de estoque.' });
    }
  }
}

export default EstoqueController;
