import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import Category from "./routers/category";
import Product from "./routers/product";
import Item from "./routers/item";
import Order from "./routers/order";
import File from './routers/file';
import User from './routers/user/user';
import Role from './routers/user/role';
import Permission from './routers/user/permission';
import RolePermission from './routers/user/rolePermission';
import Login from './routers/login';
import Fiado from './routers/fiado';
import Fornecedor from './routers/fornecedor';
import Estoque from './routers/estoque';
import Venda from './routers/venda';
import Cosmos from './routers/cosmos';
import WhatsApp from './routers/whatsapp';
import Financeiro from './routers/financeiro';
import wellcomeRouter from "./routers/wellcome";
import authenticateToken from "./midleware/authenticate";
import { setupSwagger } from './swagger';
import { apiLimiter } from './midleware/rateLimit';

const app = express();

// Security Headers com Helmet (configurado para permitir carregar imagens e APIs sem quebrar frontend)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Desabilitado no backend para permitir Swagger UI
}));

// Desabilita o header 'X-Powered-By: Express' para evitar fingerprinting de versão do framework
app.disable('x-powered-by');

setupSwagger(app);
app.use('/files', express.static('files'));
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cors());

// Rate Limiter global para prevenir DoS
app.use(apiLimiter);

// Rotas de Autenticação e Usuários
app.use('/login', Login);
app.use('/user', authenticateToken, User);
app.use('/Role', authenticateToken, Role);
app.use('/Permission', authenticateToken, Permission);
app.use('/RolePermission', authenticateToken, RolePermission);

// Rotas de Negócio do PDV e Mercadinho
app.use('/category', Category);
app.use('/product', Product);
app.use('/cosmos', Cosmos);
app.use('/whatsapp', WhatsApp);
app.use('/item', Item);
app.use('/order', Order);
app.use('/File', File);
app.use('/fiado', Fiado);
app.use('/fornecedor', Fornecedor);
app.use('/estoque', Estoque);
app.use('/venda', Venda);
app.use('/financeiro', Financeiro);
app.use('/', wellcomeRouter);

export default app;