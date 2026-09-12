# 🏪 GestorMercado (MercadoBot)

Sistema completo e moderno para gestão e ponto de venda (PDV) de mercadinhos, mercearias e pequenos comércios.

---

## 🚀 Funcionalidades Principais

1. **🛒 PDV Completo (Ponto de Venda):**
   - Leitura de código de barras com foco automático e suporte a leitor USB/Bluetooth.
   - **Leitor de Código de Barras & QR Code via Câmera (@zxing/browser)**.
   - Integração com a **Cosmos API (Bluesoft)** com auto-cadastro de novos itens no banco.
   - Carrinho de compras com cálculo automático e controle de quantidade.
   - Formas de pagamento (PIX, Dinheiro, Cartão de Crédito/Débito).
   - Baixa automática de estoque ao concluir a venda.
   - Histórico de vendas do dia em tempo real.

2. **📖 Módulo de Fiado Digital:**
   - Cadastro de débitos por cliente com WhatsApp e descrição.
   - Quitação em 1 clique com atualização de status (`PENDENTE` -> `PAGO`).

3. **📦 Módulo de Estoque Inteligente:**
   - Controle de quantidade atual e quantidade mínima.
   - Alertas automáticos de reposição para produtos críticos ou esgotados.

4. **🚚 Módulo de Fornecedores:**
   - Cadastro, edição e exclusão de fornecedores parceiros.
   - Controle de dia da semana de visitas e histórico de entregas.
   - Botão de contato direto via WhatsApp.

5. **📊 Relatórios Diários WhatsApp (node-cron):**
   - Rotina automática agendada para as 18:00 com resumo de vendas, fiados, alertas e visitas de fornecedores.

6. **🔒 Autenticação & Segurança:**
   - Login com JWT e proteção de rotas (`/login` e `/dashboard`).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, `@zxing/browser`.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL / SQLite, `node-cron`, Swagger.
- **Deploy:** Preparado para **Railway** (Backend) e **Vercel** (Frontend).

---

## 📦 Como Rodar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/menochef777/mercadobot.git
cd mercadobot
```

### 2. Rodar o Backend (`simple-pdv`)
```bash
cd simple-pdv
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```
O backend rodará em `http://localhost:3000` (Documentação Swagger em `http://localhost:3000/api-docs`).

### 3. Rodar o Frontend (`frontend`)
```bash
cd ../frontend
npm install
npm run dev
```
O frontend rodará em `http://localhost:5173`.

---

## ☁️ Deploy

- **Backend no Railway:** Conecte o repositório, adicione um serviço PostgreSQL e defina as variáveis de ambiente (`DATABASE_URL`, `JWT_SECRET`, `REFRESH_JWT_SECRET`). O `Procfile` iniciará o servidor automaticamente.
- **Frontend na Vercel:** Importe o repositório, selecione a pasta `frontend` como root e defina a variável `VITE_API_URL` apontando para o seu backend no Railway.
