import { HttpStatus } from '@/enums';
import { sendErrorResponse } from '@/responses';
import { Request, Response } from 'express';

const notFound = async (req: Request, res: Response) => {
  return sendErrorResponse(res, HttpStatus.NOT_FOUND, { error: { message: 'Request Endpoint Not Found.' } });
};

export { notFound };
