import path from "path";
import { Request, Response, NextFunction } from "express";
import getLogger from "../utils/logger";
import StatusCodeEnums from "../enums/StatusCodeEnum";

const logger = getLogger("ERROR_LOG");

interface CustomError extends Error {
  code?: number;
  stack?: string;
}

const errorLog = async (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const stack = err.stack || "";

  // Parse stack trace to extract file and source information
  const match = stack.match(/\s+at (\S+) \((.*):(\d+):(\d+)\)/);
  const source = match ? match[1] : "Unknown source";
  const filePath = match ? match[2] : "Unknown file";
  const fileName = path.basename(filePath);

  const logMessage = `
  An error occurred in the application
  Code: ${err.code || StatusCodeEnums.InternalServerError_500}
  Message: ${err.message}
  File: ${fileName}
  Source: ${source}
  Stack Trace:
  ${stack}
  `;
  logger.error(logMessage);

  try {
    // Save the error to the database
    const errorData = {
      code: err.code?.toString() || "500",
      message: err.message,
      file: fileName,
      source: source,
      stackTrace: stack,
    };
    // const connection = new DatabaseTransaction();
    // const result = await connection.errorRepository.createErrorRepository(
    //   errorData
    // );

    logger.info(`Error saved to database with ID: ${result._id}`);
  } catch (dbError: any) {
    logger.error(`Error saving error to database: ${dbError.message}`);
  } finally {
    // Check if the error is MongoDB-related
    if (err.name && err.name.toLowerCase().includes("mongo")) {
      return res
        .status(StatusCodeEnums.InternalServerError_500)
        .json({ message: `Database Error: ${err.message}` });
    }

    const statusCode = Object.values(StatusCodeEnums).includes(err.code || 0)
      ? err.code || StatusCodeEnums.InternalServerError_500
      : StatusCodeEnums.InternalServerError_500;

    return res.status(statusCode).json({ message: err.message });
  }
};

export default errorLog;
