import express from "express";
import AuthController from "../controllers/AuthController";
import loginHandler from "../handlers/Auth/LoginHandler";
import signupHandler from "../handlers/Auth/SignupHandler";
import AuthMiddleware from "../middlewares/AuthMiddleware";

const authController: AuthController = new AuthController();

const authRoutes = express.Router();

authRoutes.post("/login", loginHandler, authController.login);

authRoutes.post("/signup", signupHandler, authController.signup);

authRoutes.post("/renew-access-token", authController.renewAccessToken);

authRoutes.post("/verify-email", authController.verifyEmail);

authRoutes.post("/send-verification-email", authController.sendVerificationEmail);

authRoutes.post("/reset-password", authController.resetPassword);

authRoutes.post("/change-password", authController.changePassword);

authRoutes.get("/reset-password-pin", authController.sendResetPasswordPin);

authRoutes.post("/confirm-reset-password-pin", authController.confirmResetPasswordPin);

authRoutes.get("/test", () => {});

export default authRoutes;
