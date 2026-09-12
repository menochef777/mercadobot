# **Simple PDV**

Simple PDV é um sistema de ponto de venda (PDV) desenvolvido em **Node.js** com **TypeScript**, utilizando **Express** para a criação de APIs RESTful e **Prisma** como ORM para gerenciar o banco de dados. Este sistema permite o gerenciamento de usuários, produtos, pedidos, categorias, permissões e muito mais.

---

## **📋 Funcionalidades**

- **Gerenciamento de Usuários**:
  - CRUD de usuários.
  - Autenticação e autorização com JWT.
  - Atribuição de papéis (roles) e permissões.

- **Gerenciamento de Produtos**:
  - CRUD de produtos com suporte a categorias.

- **Gerenciamento de Pedidos**:
  - CRUD de pedidos e itens associados.

- **Gerenciamento de Categorias**:
  - Suporte a categorias hierárquicas.

- **Gerenciamento de Arquivos**:
  - Upload e gerenciamento de arquivos.

- **Permissões e Papéis**:
  - Controle de acesso baseado em papéis e permissões.

---

## **🚀 Tecnologias Utilizadas**

- **Node.js** com **TypeScript**
- **Express** para criação de APIs RESTful
- **Prisma** como ORM
- **SQLite** como banco de dados (pode ser substituído por outros bancos suportados pelo Prisma)
- **JWT** para autenticação
- **Swagger** para documentação da API
- **Morgan** para logs de requisições
- **Cors** para controle de acesso

---

## **📂 Estrutura do Projeto**

```plaintext
simple-pdv/
├── prisma/                # Configuração do Prisma e migrações
│   ├── schema.prisma      # Definição do modelo de dados
│   ├── migrations/        # Arquivos de migração do Prisma
│   └── seed.ts            # Script para popular o banco de dados
├── src/
│   ├── controlers/        # Controladores com a lógica de negócios
│   ├── midleware/         # Middlewares (autenticação, autorização, etc.)
│   ├── routers/           # Rotas da API
│   ├── swagger.ts         # Configuração do Swagger
│   ├── app.ts             # Configuração principal do servidor
│   └── server.ts          # Inicialização do servidor
├── package.json           # Dependências e scripts do projeto
├── tsconfig.json          # Configuração do TypeScript
└── README.md              # Documentação do projeto
```

---

## **🔑 Usuário Administrador e Papéis (Roles)**

### **Usuário Administrador**
O sistema cria automaticamente um usuário administrador ao executar o script de seed. Este usuário possui permissões completas para gerenciar o sistema.

- **Credenciais do Administrador**:
  - **Username**: `admin`
  - **Email**: `admin@example.com`
  - **Senha**: `admin123`

### **Papéis (Roles)**
Os papéis definem as permissões atribuídas aos usuários. O sistema possui três papéis básicos:

- **Admin**: Acesso total ao sistema.
- **Gerente**: Acesso gerencial, com permissões limitadas.
- **Vendedor**: Acesso básico para operações de venda.

---

## **🛠️ Instalação e Configuração**

### **1. Clone o Repositório**
```bash
git clone https://github.com/dreiver1/simple-pdv.git
cd simple-pdv
```

### **2. Instale as Dependências**
```bash
npm install
```

### **3. Configure o Banco de Dados**
Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis de ambiente:

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=3f8b9c2a4d6e7f1a2b3c4d5e6f7g8h9i
REFRESH_JWT_SECRET=9h8g7f6e5d4c3b2a1f0e9d8c7b6a5f4g
```

### **4. Execute as Migrações**
```bash
npx prisma migrate dev
```

### **5. Popule o Banco de Dados**
```bash
npm run seed
```

### **6. Inicie o Servidor**
```bash
npm run dev
```

---

## **🌐 Documentação da API**

Acesse a documentação interativa gerada pelo Swagger:

```
http://localhost:3000/api-docs
```

### **Rotas Principais**

#### **Usuários**
- `POST /user`: Criar um novo usuário.
- `GET /user`: Listar todos os usuários.
- `GET /user/{userId}`: Obter detalhes de um usuário pelo ID.
- `DELETE /user/{userId}`: Deletar um usuário.
- `PUT /user/{userId}`: Atualizar um usuário.

#### **Produtos**
- `POST /product`: Criar um novo produto.
- `GET /product`: Listar todos os produtos.
- `GET /product/{productId}`: Obter detalhes de um produto pelo ID.
- `DELETE /product/{productId}`: Deletar um produto.
- `PUT /product/{productId}`: Atualizar um produto.

#### **Pedidos**
- `POST /order`: Criar um novo pedido.
- `GET /order`: Listar todos os pedidos.
- `GET /order/{orderId}`: Obter detalhes de um pedido pelo ID.
- `DELETE /order/{orderId}`: Deletar um pedido.
- `PUT /order/{orderId}`: Atualizar um pedido.

#### **Arquivos**
- `POST /file`: Fazer upload de um arquivo.
- `GET /file`: Listar todos os arquivos.
- `GET /file/{fileId}`: Obter detalhes de um arquivo pelo ID.
- `DELETE /file/{fileId}`: Deletar um arquivo.

---

## **🧪 Testes**

Os testes estão localizados na pasta test. Para executá-los, use:

```bash
npm run test
```

---

## **📜 Licença**

Este projeto está licenciado sob a MIT License.

---

## **📬 Contato**

- **Autor**: David Bezerra
- **Email**: [david.bezerra@ufrpe.br](mailto:david.bezerra@ufrpe.br)
- **GitHub**: [dreiver1](https://github.com/dreiver1)
