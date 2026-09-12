import { Router } from 'express';
import VendaController from '../controlers/Venda';
import { validateBody } from '../midleware/validate';
import { vendaCreateSchema } from '../schemas';

const control = new VendaController();
const app = Router();

app.post('/', validateBody(vendaCreateSchema), control.post);
app.get('/hoje', control.getHoje);

export default app;
