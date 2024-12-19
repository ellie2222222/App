import { Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";
import StatusCodeEnum from "../enums/StatusCodeEnum";
import ms from "ms";

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
      const middlewareData = req.body.middleware;

      const { accessToken, refreshToken } = await this.authService.login(email, password, middlewareData);

      const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION!;
      const refreshTokenMaxAge = ms(REFRESH_TOKEN_EXPIRATION);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });

      res.status(StatusCodeEnum.OK_200).json({
        message: "Login successful",
        data: { 
          accessToken
        }
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
  renewAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      const newAccessToken = await this.authService.renewAccessToken(refreshToken);

      res.status(StatusCodeEnum.OK_200).json({
        message: "Success",
        data: { 
          accessToken: newAccessToken
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
