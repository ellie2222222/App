import express from "express";
import AuthController from "../controllers/AuthController";

const authController: AuthController = new AuthController();

const authRoutes = express.Router();

authRoutes.post("/login", authController.login);

authRoutes.post("/signup", authController.signup);

export default authRoutes;
