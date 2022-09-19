import { HttpStatus, JwtTokenIssuerType } from '@/enums';
import { User } from '@/models';
import { sendErrorResponse, sendOperationalErrorResponse } from '@/responses';
import { veriftToken } from '@/utils';
import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import moment from 'moment';

const authenticated = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers?.authorization || !req.headers?.authorization?.startsWith('Bearer')) {
        return sendErrorResponse(res, HttpStatus.UNAUTHORIZE, {
          error: { message: 'you are not loged in please login to get access..' },
        });
      }

      const token = req.headers?.authorization?.split(' ')?.[1];
      const decodedToken = veriftToken(token, JwtTokenIssuerType.ACCESS) as {
        userId: string;
        iat: number;
        exp: number;
      };

      const userFromToken = await User.findById(decodedToken.userId).select('+passLastUpdated');
      if (!userFromToken)
        return sendErrorResponse(res, HttpStatus.UNAUTHORIZE, {
          error: { message: 'user belongs to token not avalable anymore.' },
        });

      if (userFromToken.passLastUpdated && moment(userFromToken.passLastUpdated) >= moment(decodedToken.iat * 1000)) {
        return sendErrorResponse(res, HttpStatus.UNAUTHORIZE, {
          error: { message: 'user recently changed password please log in again.' },
        });
      }

      return next();
    } catch (err) {
      if ([TokenExpiredError, JsonWebTokenError].some((el) => err instanceof el)) {
        return sendErrorResponse(res, HttpStatus.UNAUTHORIZE, {
          error: { message: 'token is expired or invalid token.' },
        });
      }
      return sendOperationalErrorResponse(res, err as Error);
    }
  };
};

export { authenticated };
