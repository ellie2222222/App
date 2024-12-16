import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { match } from "path-to-regexp";
import publicRoutes from "../routes/PublicRoute";
import getLogger from "../utils/logger";
import StatusCodeEnum from "../enums/StatusCodeEnum";

const logger = getLogger("AUTHENTICATION");

interface JwtPayload {
  userId: string;
  ip: string;
}

const isUnprotectedRoute = (path: string, method: string): boolean => {
  const pathname = path.split("?")[0];

  const matchedRoute = publicRoutes.find((route) => {
    const matchFn = match(route.path, { decode: decodeURIComponent });
    const matched = matchFn(pathname);
    matched && route.method === method && matched.path === pathname;
  });

  if (matchedRoute) return true;
  return false;
};

const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const isUnprotected = isUnprotectedRoute(req.originalUrl, req.method);
  const { authorization } = req.headers;

  if (isUnprotected && authorization) {
    try {
      const token = authorization.split(" ")[1];
      const { userId } = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;

      if (mongoose.Types.ObjectId.isValid(userId)) {
        req.body.requesterId = userId;
        logger.info(`Valid token for User ID: ${userId}`);
      } else {
        logger.warn("Invalid user ID in token.");
      }
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        logger.warn("Token expired.");
      } else if (error.name === "JsonWebTokenError") {
        logger.warn("Invalid token.");
      } else {
        logger.error(`Token verification error: ${error.message}`);
      }
    }

    next();
  }

  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!authorization) {
    res
      .status(StatusCodeEnum.Unauthorized_401)
      .json({ message: "Authorization token required" });
  } else {
    const token = authorization.split(" ")[1];

    try {
      const { userId } = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res
          .status(StatusCodeEnum.Unauthorized_401)
          .json({ message: "Invalid token. Request is not authorized." });
      }

      req.body.requesterId = userId;

      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        res.status(StatusCodeEnum.Unauthorized_401).json({
          message: "Token expired. Please log in again.",
        });
      } else if (error.name === "JsonWebTokenError") {
        res.status(StatusCodeEnum.Unauthorized_401).json({
          message: "Invalid token. Request is not authorized.",
        });
      }
      res
        .status(StatusCodeEnum.InternalServerError_500)
        .json({ message: error.message });
    }
  }
};

export default AuthMiddleware;
