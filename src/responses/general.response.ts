import { defaultErrorResponseInterface, defaultSuccessResponseInterface } from '@/interfaces';
import { HttpStatus } from '@/enums';
import { Response } from 'express';
import { Envormrnt } from '@/config';

const defaultSuccessResponse: defaultSuccessResponseInterface = {
  type: 'success',
  data: null,
  message: null,
  count: null,
  pagination: null,
  error: null,
};

const defaultErrorResponse: defaultErrorResponseInterface = {
  type: 'fail',
  error: { message: 'something went wrong.', failedValidationMessages: null, stack: null },
};

const defaultOperationalErrorResponse: defaultErrorResponseInterface = {
  type: 'fail',
  error: { message: 'something went wrong.', failedValidationMessages: null, stack: null },
};

const sendSuccessResponse = (
  res: Response,
  status: HttpStatus,
  {
    type = defaultSuccessResponse.type,
    data = defaultSuccessResponse.data,
    message = defaultSuccessResponse.message,
    count = defaultSuccessResponse.count,
    pagination = defaultSuccessResponse.pagination,
    error = defaultSuccessResponse.error,
  }: defaultSuccessResponseInterface = defaultSuccessResponse,
) => {
  if (Envormrnt.NODE_ENV !== 'development') delete error?.stack;

  return res.status(status).json({ type, data, message, count, pagination, error });
};

const sendErrorResponse = (
  res: Response,
  status: HttpStatus,
  { type = defaultErrorResponse.type, error = defaultErrorResponse.error }: defaultErrorResponseInterface,
) => {
  error = { ...defaultErrorResponse.error, ...error };

  if (Envormrnt.NODE_ENV !== 'development') delete error?.stack;

  return res.status(status).json({ type, error });
};

const sendOperationalErrorResponse = (
  res: Response,
  err: Error,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERR,
) => {
  console.log('--------------------------- Error ----------------------');
  console.log(`Name: ${err.name}`);
  console.log(`Message: ${err.message}`);
  console.log(`Stack: ${err.stack}`);
  console.log(`err:${err}`);
  console.log('--------------------------- Error ----------------------');

  const payload = { ...defaultOperationalErrorResponse, error: { message: err.message, stack: err.stack } };
  if (Envormrnt.NODE_ENV !== 'development') delete payload?.error?.stack;

  return res.status(status).json(payload);
};

export { sendSuccessResponse, sendErrorResponse, sendOperationalErrorResponse };
