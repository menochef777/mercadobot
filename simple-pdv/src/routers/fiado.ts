import { Router } from 'express';
import FiadoController from '../controlers/Fiado';
import { validateBody } from '../midleware/validate';
import { fiadoCreateSchema } from '../schemas';

const control = new FiadoController();
const app = Router();

app.post('/', validateBody(fiadoCreateSchema), control.post);
app.get('/', control.get);
app.get('/:id', control.getById);
app.patch('/:id/pagar', control.pagar);

export default app;
