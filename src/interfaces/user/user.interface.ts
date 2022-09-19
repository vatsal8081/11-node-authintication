interface userInterface {
  name: string;
  email: string;
  contact?: number;
  password: string;
}

interface userModelInterface extends Omit<userInterface, 'password'> {
  password?: string;
  passLastUpdated?: Date;
}

interface signInValidatorInterface extends userInterface {}

interface logInValidatorInterface extends Omit<userInterface, 'name' | 'contact'> {}

interface forgotPasswordValidatorInterface {
  email: string;
}
interface restePasswordValidatorInterface {
  newPassword: string;
}

export {
  userInterface,
  userModelInterface,
  signInValidatorInterface,
  logInValidatorInterface,
  forgotPasswordValidatorInterface,
  restePasswordValidatorInterface,
};
