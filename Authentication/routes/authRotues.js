import { Router } from "express";
import {register, login, getUser, refreshToken, logout, logoutAll, verifyEmail} from "../controllers/authController.js";
const authRouter = Router();

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/get-me', getUser)
authRouter.get('/refresh-token', refreshToken)
authRouter.get('/logout', logout)
authRouter.get('/logout-all', logoutAll)
authRouter.get('/verify-email', verifyEmail)
export default authRouter;
