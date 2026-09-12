import { Router } from "express";
import userController from "../controlers/User/User";
import { authLimiter } from "../midleware/rateLimit";
import { validateBody } from "../midleware/validate";
import { loginSchema, refreshTokenSchema } from "../schemas";

const app = Router();
const controler = new userController();

app.post('/', authLimiter, validateBody(loginSchema), controler.loginUser);
app.post('/refresh', authLimiter, validateBody(refreshTokenSchema), controler.refreshTokens);

export default app;