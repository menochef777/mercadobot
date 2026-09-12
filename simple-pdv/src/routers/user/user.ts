import { Router } from "express";
import userController from "../../controlers/User/User";
import authorizePermission from "../../midleware/authorizate";
import { validateBody } from "../../midleware/validate";
import { userCreateSchema, userUpdateSchema } from "../../schemas";

const app = Router();
const user = new userController();

app.post('/', authorizePermission('CREATE_USER'), validateBody(userCreateSchema), user.post);
app.get('/', user.get);
app.get('/:userId', user.getById);
app.get('/name/:name', user.getByName);
app.get('/username/:userName', user.getByUserName);
app.delete('/:userId', authorizePermission('DELETE_USER'), user.delete);
app.put('/:userId', authorizePermission('UPDATE_USER'), validateBody(userUpdateSchema), user.put);

export default app;