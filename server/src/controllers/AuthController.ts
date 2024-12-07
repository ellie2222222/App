import { Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";
import StatusCodeEnum from "../enums/StatusCodeEnum";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      const token = this.authService.login(email, password);

      res.status(StatusCodeEnum.OK_200).json({
        message: "Success",
        token,
      });
    } catch (error) {
      next(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const token = this.authService.signup(name, email, password);

      res.status(StatusCodeEnum.Created_201).json({
        message: "Success",
        token,
      });
    } catch (error) {
      next(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default AuthController;
