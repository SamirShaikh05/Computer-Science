import { Router } from "express";
import {register, getUser, refreshToken } from "../controllers/authController.js";
const authRouter = Router();

authRouter.post('/register', register)
authRouter.get('/get-me', getUser)
authRouter.get('/refresh-token', refreshToken)
export default authRouter;
