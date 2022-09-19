import { HttpStatus } from '@/enums';
import { sendErrorResponse } from '@/responses';
import { ValidateFunction } from 'ajv';
import { NextFunction, Request, Response } from 'express';
export {
  signInValidator,
  logInValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '@/validations/auth/auth.validation';

const validateReqiest = (validator: ValidateFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const valid = validator(req.body);
    if (!valid) {
      const validationErrors = validator.errors;
      return sendErrorResponse(res, HttpStatus.BAD_REQUEST, {
        error: { message: 'Validation Fail', failedValidationMessages: validationErrors },
      });
    }
    return next();
  };
};

export { validateReqiest };
