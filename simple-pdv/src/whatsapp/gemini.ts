import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ProdutoNotaFiscal {
  nome: string;
  quantidade: number;
  valorUnitario: number;
}

export async function lerNotaFiscal(
  imagemBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<ProdutoNotaFiscal[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'sua-chave') {
    console.warn('⚠️ [Gemini] GEMINI_API_KEY não configurada no ambiente.');
    throw new Error('GEMINI_API_KEY não configurada.');
  }

  // Remove cabeçalho data:image/...;base64, se presente
  const cleanBase64 = imagemBase64.replace(/^data:image\/[a-z0-9-+.]+;base64,/i, '');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt =
    'Analise esta nota fiscal ou cupom fiscal brasileiro. Liste todos os produtos com: nome, quantidade e valor unitário. Responda APENAS em JSON array: [{"nome": "string", "quantidade": number, "valorUnitario": number}]. Não adicione texto extra nem explicações.';

  const imagePart = {
    inlineData: {
      data: cleanBase64,
      mimeType: mimeType || 'image/jpeg',
    },
  };

  try {
    console.log('🤖 [Gemini] Processando imagem de nota fiscal com Gemini 1.5 Flash...');
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text().trim();

    console.log('🤖 [Gemini] Resposta recebida:', responseText);

    // Limpa blocos de código markdown se existirem (```json ... ```)
    const jsonCleaned = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const produtos = JSON.parse(jsonCleaned);

    if (!Array.isArray(produtos)) {
      throw new Error('Formato retornado pelo Gemini não é uma lista de produtos.');
    }

    return produtos.map((item: any) => ({
      nome: String(item.nome || item.name || 'Produto').trim(),
      quantidade: Math.max(1, Number(item.quantidade || item.qtd || item.quantity || 1)),
      valorUnitario: Number(item.valorUnitario || item.valor || item.unitPrice || item.preco || 0),
    }));
  } catch (error: any) {
    console.error('❌ [Gemini] Erro ao ler nota fiscal com IA:', error.message || error);
    throw error;
  }
}

export default {
  lerNotaFiscal,
};
