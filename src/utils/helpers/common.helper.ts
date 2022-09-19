import { Envormrnt } from '@/config';
import { hash } from 'bcrypt';
import { JwtPayload, sign as signTokne, verify as verifyToken } from 'jsonwebtoken';
import { compare as compairPasswords } from 'bcrypt';
import { JwtTokenIssuerType } from '@/enums';

export const createHashPassword = async (password: string) => {
  return await hash(password, 12);
};

export const generateToken = (
  issuer: JwtTokenIssuerType = JwtTokenIssuerType.ACCESS,
  payload: string | object = '',
  options = {},
) => {
  const secretFromEnv = Envormrnt[`JWT_${issuer.toUpperCase()}_SECRET`]!;
  const expiresInFromEnv = Envormrnt[`JWT_${issuer.toUpperCase()}_EXPIRES_IN`]!;

  const newToken = signTokne(payload, secretFromEnv, { expiresIn: expiresInFromEnv });
  return newToken;
};

export const compairTwoPasswords = async (passOne: string, passTwo: string) => {
  if (!passOne || !passTwo) return false;
  return await compairPasswords(passOne, passTwo);
};

export const veriftToken = (token: string, issuer: JwtTokenIssuerType = JwtTokenIssuerType.ACCESS) => {
  const secretFromEnv = Envormrnt[`JWT_${issuer.toUpperCase()}_SECRET`]!;
  const varify = verifyToken(token, secretFromEnv);
  return varify;
};
