import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { match } from "path-to-regexp";
import publicRoutes from "../routes/PublicRoute";
import getLogger from "../utils/logger";
import StatusCodeEnum from "../enums/StatusCodeEnum";
import { UAParser } from "ua-parser-js";

const logger = getLogger("AUTHENTICATION");

interface JwtPayload {
  userId: string;
  ip: string;
}

const isPublicRoute = (path: string, method: string): boolean => {
  const pathname = path.split("?")[0];

  const matchedRoute = publicRoutes.find((route) => {
    const matchFn = match(route.path, { decode: decodeURIComponent });
    const matched = matchFn(pathname);
    return matched && route.method === method;
  });

  return !!matchedRoute;
};

const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Attach information to req for further process
  const ipAddress =
    typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"].split(",")[0]
      : req.socket.remoteAddress;
  const userAgent: string = req.headers["user-agent"]!;

  const parser = new UAParser();
  const parsedDevice = parser.setUA(userAgent).getResult();

  const userAgentData = parsedDevice.ua;
  const browserData = {
    name: parsedDevice.browser.name || "Unknown",
    version: parsedDevice.browser.version || "Unknown",
  };
  const osData = {
    name: parsedDevice.os.name || "Unknown",
    version: parsedDevice.os.version || "Unknown",
  };
  const deviceData = {
    type: parsedDevice.device.type || "Unknown",
    model: parsedDevice.device.model || "Unknown",
    vendor: parsedDevice.device.vendor || "Unknown",
  };

  req.body.middleware = {
    ...req.body.middleware,
    ipAddress,
    userAgent: userAgentData,
    browser: browserData,
    os: osData,
    device: deviceData,
  };

  // Handle public route
  const isPublic = isPublicRoute(req.originalUrl, req.method);
  const { authorization } = req.headers;

  if (isPublic) {
    try {
      const token = authorization?.split(" ")[1] || "";
      const { userId } = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;

      if (mongoose.Types.ObjectId.isValid(userId)) {
        req.body.middleware.userId = userId;
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
    return;
  }

  // Handle protected route
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

      // Attach information to req for further process
      req.body.middleware = {
        ...req.body.middleware,
        userId,
      };

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
