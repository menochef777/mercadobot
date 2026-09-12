import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ProdutoNotaFiscal {
  nome: string;
  quantidade: number;
  valorUnitario: number;
}

export interface DadosNotaFiscal {
  produtos: ProdutoNotaFiscal[];
  valorTotal: number;
  dataVencimento: string | null;
  nomeFornecedor: string | null;
}

const MODELOS_SUPORTADOS = [
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
];

export async function lerNotaFiscal(
  imagemBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<DadosNotaFiscal> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'sua-chave') {
    console.warn('⚠️ [Gemini] GEMINI_API_KEY não configurada no ambiente.');
    throw new Error('GEMINI_API_KEY não configurada.');
  }

  // Remove cabeçalho data:image/...;base64, se presente
  const cleanBase64 = imagemBase64.replace(/^data:image\/[a-z0-9-+.]+;base64,/i, '');

  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `Analise esta nota fiscal brasileira. Extraia:
1. Lista de produtos com nome, quantidade e valorUnitario
2. valorTotal da nota
3. dataVencimento se existir (formato DD/MM/YYYY)
4. nomeFornecedor se aparecer

Responda APENAS em JSON no formato:
{
  "produtos": [{"nome": "string", "quantidade": number, "valorUnitario": number}],
  "valorTotal": number,
  "dataVencimento": string ou null,
  "nomeFornecedor": string ou null
}`;

  const imagePart = {
    inlineData: {
      data: cleanBase64,
      mimeType: mimeType || 'image/jpeg',
    },
  };

  let lastError: any = null;

  for (const modelName of MODELOS_SUPORTADOS) {
    try {
      console.log(`🤖 [Gemini] Processando com modelo ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text().trim();

      console.log('🤖 [Gemini] Resposta recebida:', responseText);

      // Limpa blocos de código markdown se existirem (```json ... ```)
      const jsonCleaned = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      const parsed = JSON.parse(jsonCleaned);

      // Suporta tanto o objeto estruturado quanto array direto caso a IA retorne
      const rawProdutos = Array.isArray(parsed) ? parsed : (parsed.produtos || []);
      const produtos: ProdutoNotaFiscal[] = rawProdutos.map((item: any) => ({
        nome: String(item.nome || item.name || 'Produto').trim(),
        quantidade: Math.max(1, Number(item.quantidade || item.qtd || item.quantity || 1)),
        valorUnitario: Number(item.valorUnitario || item.valor || item.unitPrice || item.preco || 0),
      }));

      const valorTotal = Number(
        parsed.valorTotal ||
        produtos.reduce((acc, p) => acc + p.quantidade * p.valorUnitario, 0)
      );

      const dataVencimento =
        typeof parsed.dataVencimento === 'string' && parsed.dataVencimento.trim() !== '' && parsed.dataVencimento.toLowerCase() !== 'null'
          ? parsed.dataVencimento.trim()
          : null;

      const nomeFornecedor =
        typeof parsed.nomeFornecedor === 'string' && parsed.nomeFornecedor.trim() !== '' && parsed.nomeFornecedor.toLowerCase() !== 'null'
          ? parsed.nomeFornecedor.trim()
          : null;

      return {
        produtos,
        valorTotal,
        dataVencimento,
        nomeFornecedor,
      };
    } catch (error: any) {
      console.warn(`⚠️ [Gemini] Falha no modelo ${modelName}:`, error.message);
      lastError = error;
    }
  }

  throw lastError || new Error('Nenhum modelo Gemini compatível respondeu com sucesso.');
}

export default {
  lerNotaFiscal,
};
