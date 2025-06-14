import logger from '../config/logger';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(statusCode: number, message: string, details?: any, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  public logError(): void {
    const logLevel = this.statusCode >= 500 ? 'error' : 'warn';
    logger.log(logLevel, {
      type: this.constructor.name,
      statusCode: this.statusCode,
      message: this.message,
      details: this.details,
    });
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access', details?: any) {
    super(401, message, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access', details?: any) {
    super(403, message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(404, message, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(409, message, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(500, message, details);
  }
}
