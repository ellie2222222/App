class CustomException extends Error {
  public errorCode: number;

  constructor(errorCode: number, message: string) {
    super(message);
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomException;
