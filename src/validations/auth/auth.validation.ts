import {
  forgotPasswordValidatorInterface,
  logInValidatorInterface,
  restePasswordValidatorInterface,
  signInValidatorInterface,
} from '@/interfaces';
import { ajv } from '@/plugins';
import { JSONSchemaType } from 'ajv';

const signUpValidationSchima: JSONSchemaType<signInValidatorInterface> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    contact: { type: 'integer', nullable: true },
    password: { type: 'string', format: 'password' },
  },
  required: ['name', 'email', 'password'],
  additionalProperties: true,
};

const loginValidationSchima: JSONSchemaType<logInValidatorInterface> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', format: 'password' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

const forgotPasswordValidationSchima: JSONSchemaType<forgotPasswordValidatorInterface> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
  },
  required: ['email'],
  additionalProperties: false,
};

const restePasswordValidationSchima: JSONSchemaType<restePasswordValidatorInterface> = {
  type: 'object',
  properties: {
    newPassword: { type: 'string', format: 'password' },
  },
  required: ['newPassword'],
  additionalProperties: false,
};

const signInValidator = ajv.compile(signUpValidationSchima);
const logInValidator = ajv.compile(loginValidationSchima);
const forgotPasswordValidator = ajv.compile(forgotPasswordValidationSchima);
const resetPasswordValidator = ajv.compile(restePasswordValidationSchima);

export { signInValidator, logInValidator, forgotPasswordValidator, resetPasswordValidator };
