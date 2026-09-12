import { Router } from "express"
import Permission from '../../controlers/User/Permission'

const app = Router()

const controller = new Permission()

app.get('/', controller.get )
app.post('/', controller.post)
app.delete('/:id', controller.delete)
app.put('/:id', controller.put)
app.get('/:id', controller.getById)

export default app