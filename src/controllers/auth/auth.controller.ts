import { HttpStatus, JwtTokenIssuerType } from '@/enums';
import { User } from '@/models';
import { sendErrorResponse, sendOperationalErrorResponse, sendSuccessResponse } from '@/responses';
import { compairTwoPasswords, generateToken, veriftToken } from '@/utils';
import { Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import moment from 'moment';

const signInUser = async (req: Request, res: Response) => {
  try {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      ...(req.body.contact && { contact: req.body.contact }),
      password: req.body.password,
    };

    const newUser = await (await new User(userData).save()).toObject();
    delete newUser.password;
    delete newUser.passLastUpdated;
    const newToken = generateToken(JwtTokenIssuerType.ACCESS, { userId: newUser._id });

    return sendSuccessResponse(res, HttpStatus.CREATED, { data: { user: newUser, token: newToken } });
  } catch (err) {
    return sendOperationalErrorResponse(res, err as Error);
  }
};

const logInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return sendOperationalErrorResponse(res, new Error('email or password not provided.'), HttpStatus.BAD_REQUEST);

    const user = await User.findOne({ email: req.body.email }).select('+password +passLastUpdated');

    if (!user)
      return sendErrorResponse(res, HttpStatus.UNAUTHORIZE, { error: { message: 'incorrect email of passower.' } });

    const isCorrectPassword = await compairTwoPasswords(password, user.password!);

    if (!isCorrectPassword)
      return sendErrorResponse(res, HttpStatus.UNAUTHORIZE, { error: { message: 'incorrect email of passower.' } });

    const token = generateToken(JwtTokenIssuerType.ACCESS, { userId: user._id });
    return sendSuccessResponse(res, HttpStatus.OK, { data: { token } });
  } catch (err) {
    return sendOperationalErrorResponse(res, err as Error);
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return sendOperationalErrorResponse(res, new Error('no email provided.'), HttpStatus.BAD_REQUEST);

    const user = await User.findOne({ email });

    if (!user)
      return sendErrorResponse(res, HttpStatus.NOT_FOUND, { error: { message: `user with ${email} not found.` } });

    const token = generateToken(JwtTokenIssuerType.RESET_PASS, { userId: user._id, userEmail: user.email });

    return sendSuccessResponse(res, HttpStatus.OK, { data: { token } });
  } catch (err) {
    return sendOperationalErrorResponse(res, err as Error);
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const passwordResteToken = req.params.passwordResteToken;

    if (!passwordResteToken) return sendOperationalErrorResponse(res, new Error('to reset password token provided.'));

    const decodedToken = veriftToken(passwordResteToken, JwtTokenIssuerType.RESET_PASS) as {
      userId: string;
      userEmail: string;
      iat: number;
      exp: number;
    };

    const userFromToken = await User.findById(decodedToken.userId);
    if (!userFromToken)
      return sendErrorResponse(res, HttpStatus.NOT_FOUND, {
        error: { message: 'user belongs to token not avalable.' },
      });

    userFromToken.password = req.body.newPassword;
    userFromToken.passLastUpdated = moment().toISOString() as unknown as Date;
    await userFromToken.save();

    const token = generateToken(JwtTokenIssuerType.ACCESS, { userId: userFromToken._id });

    return sendSuccessResponse(res, HttpStatus.OK, { data: { token } });
  } catch (err) {
    if ([TokenExpiredError, JsonWebTokenError].some((el) => err instanceof el)) {
      return sendErrorResponse(res, HttpStatus.BAD_REQUEST, {
        error: { message: 'token is expired or invalid token.' },
      });
    }
    return sendOperationalErrorResponse(res, err as Error);
  }
};

export { signInUser, logInUser, forgotPassword, resetPassword };
