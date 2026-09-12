import { Router } from "express"
import rolePermissions from '../../controlers/User/rolePermissions'

const app = Router()

const controller = new rolePermissions()

app.get('/', controller.get )
app.post('/', controller.post)
app.delete('/', controller.delete)
app.put('/', controller.put)
app.get('/:roleId', controller.getById)

export default app