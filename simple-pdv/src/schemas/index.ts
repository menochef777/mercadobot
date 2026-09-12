import { z } from 'zod';

// ==========================================
// AUTHENTICATION & USERS
// ==========================================
export const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10, 'Token de atualização inválido'),
});

export const userCreateSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  userName: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  cpf: z.string().min(11, 'CPF deve ter no mínimo 11 dígitos'),
  roleName: z.string().min(1, 'Role é obrigatória'),
  data: z.string().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('E-mail inválido').optional(),
  roleName: z.string().optional(),
  data: z.string().optional(),
});

// ==========================================
// FIADO
// ==========================================
export const fiadoCreateSchema = z.object({
  nomeCliente: z.string().min(2, 'Nome do cliente é obrigatório'),
  telefoneCliente: z.string().nullable().optional(),
  valor: z.coerce.number().positive('O valor deve ser positivo'),
  descricao: z.string().nullable().optional(),
});

// ==========================================
// VENDAS
// ==========================================
export const vendaCreateSchema = z.object({
  valor: z.coerce.number().positive('O valor da venda deve ser maior que zero'),
  formaPagamento: z.string().optional().default('Dinheiro'),
  cliente: z.string().nullable().optional(),
  itens: z.string().nullable().optional(),
});

// ==========================================
// FORNECEDOR
// ==========================================
export const fornecedorCreateSchema = z.object({
  nome: z.string().min(2, 'Nome do fornecedor é obrigatório'),
  telefone: z.string().nullable().optional(),
  produtos: z.string().nullable().optional(),
  diaVisita: z.string().nullable().optional(),
  ultimaEntregaData: z.string().nullable().optional(),
  ultimaEntregaValor: z.coerce.number().nullable().optional(),
});

export const fornecedorUpdateSchema = fornecedorCreateSchema.partial();

// ==========================================
// FINANCEIRO / CONTAS A PAGAR
// ==========================================
export const contaPagarCreateSchema = z.object({
  nomeFornecedor: z.string().optional().default('Fornecedor Avulso'),
  valor: z.coerce.number().positive('O valor da conta deve ser positivo'),
  dataVencimento: z.string().nullable().optional(),
  status: z.enum(['PENDENTE', 'PAGO']).optional().default('PENDENTE'),
});

// ==========================================
// PRODUTOS
// ==========================================
export const productCreateSchema = z.object({
  name: z.string().min(1, 'Nome do produto é obrigatório'),
  price: z.coerce.number().nonnegative('Preço deve ser maior ou igual a zero'),
  costPrice: z.coerce.number().nonnegative().optional(),
  barcode: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  discount: z.coerce.number().optional(),
  sku: z.string().nullable().optional(),
  stockQuantity: z.coerce.number().optional(),
  quantidadeAtual: z.coerce.number().optional(),
  quantidadeMinima: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  categoryId: z.string().nullable().optional(),
  imgURL: z.string().nullable().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

// ==========================================
// ESTOQUE
// ==========================================
export const estoqueUpdateSchema = z.object({
  quantidadeAtual: z.coerce.number().nonnegative().optional(),
  quantidadeMinima: z.coerce.number().nonnegative().optional(),
  adicionar: z.coerce.number().optional(),
});
