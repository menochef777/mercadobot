const express = require('express')
import Category from "./routers/category"
import Product from "./routers/product"
import Item from "./routers/item"
import Order from "./routers/order"
import File from './routers/file'
import User from './routers/user/user'
import Role from './routers/user/role'
import Permission from './routers/user/permission'
import RolePermission from './routers/user/rolePermission'
import Login from './routers/login'
import Fiado from './routers/fiado'
import Fornecedor from './routers/fornecedor'
import Estoque from './routers/estoque'
import Venda from './routers/venda'
import Cosmos from './routers/cosmos'
import WhatsApp from './routers/whatsapp'
import wellcomeRouter from "./routers/wellcome"
import cors = require('cors')
import authenticateToken from "./midleware/authenticate"
import swaggerUi from 'swagger-ui-express';
import { setupSwagger } from './swagger'

const morgan = require('morgan')


const app = express()
setupSwagger(app);
app.use('/files', express.static('files'))
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

app.use('/login', Login)

app.use('/user', authenticateToken,  User)
app.use('/Role', authenticateToken, Role)
app.use('/Permission', authenticateToken, Permission)
app.use('/RolePermission',authenticateToken, RolePermission)
app.use('/category', Category)
app.use('/product', Product)
app.use('/cosmos', Cosmos)
app.use('/whatsapp', WhatsApp)
app.use('/item', Item)
app.use('/order', Order)
app.use('/File', File)
app.use('/fiado', Fiado)
app.use('/fornecedor', Fornecedor)
app.use('/estoque', Estoque)
app.use('/venda', Venda)
app.use('/', wellcomeRouter)


export default app