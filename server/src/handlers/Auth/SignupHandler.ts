import { Request, Response, NextFunction } from "express";
import validator from "validator";
import StatusCodeEnum from "../../enums/StatusCodeEnum";

/**
 * Validates input for signup requests.
 */
const signupHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, password } = req.body;

  const validationErrors: { field: string; error: string }[] = [];

  // Validate name
  if (!name || !validator.isLength(name, { min: 1 })) {
    validationErrors.push({
      field: "name",
      error: "Name must be at least 1 characters long",
    });
  }

  // Validate email
  if (!email || !validator.isEmail(email)) {
    validationErrors.push({
      field: "email",
      error: "Invalid email format",
    });
  }

  // Validate password
  if (
    !password ||
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }) ||
    password.length > 50
  ) {
    validationErrors.push({
      field: "password",
      error:
        "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol, and be between 8-50 characters long.",
    });
  }

  if (validationErrors.length > 0) {
    res.status(StatusCodeEnum.BadRequest_400).json({
      message: "Validation failed",
      validationErrors,
    });
  } else {
    next(); // Input is valid, proceed to the next middleware or controller
  }
};

export default signupHandler;
