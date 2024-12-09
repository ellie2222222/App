import { Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";
import StatusCodeEnum from "../enums/StatusCodeEnum";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Handles user login.
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken } = await this.authService.login(email, password);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(StatusCodeEnum.OK_200).json({
        message: "Login successful",
        accessToken
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles user signup.
   */
  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      await this.authService.signup(name, email, password);

      res.status(StatusCodeEnum.Created_201).json({
        message: "Signup successful"
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles refreshing of an access token.
   */
  refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      const newAccessToken = await this.authService.refreshAccessToken(refreshToken);

      res.status(StatusCodeEnum.OK_200).json({
        message: "Success",
        accessToken: newAccessToken,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
