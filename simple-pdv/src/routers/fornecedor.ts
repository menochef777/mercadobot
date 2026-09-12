import { Router } from 'express';
import FornecedorController from '../controlers/Fornecedor';
import { validateBody } from '../midleware/validate';
import { fornecedorCreateSchema, fornecedorUpdateSchema } from '../schemas';

const control = new FornecedorController();
const app = Router();

app.post('/', validateBody(fornecedorCreateSchema), control.post);
app.get('/', control.get);
app.get('/:id', control.getById);
app.put('/:id', validateBody(fornecedorUpdateSchema), control.put);
app.delete('/:id', control.delete);

export default app;
