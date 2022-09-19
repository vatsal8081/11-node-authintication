import { forgotPassword, logInUser, resetPassword, signInUser } from '@/controllers';
import {
  forgotPasswordValidator,
  logInValidator,
  resetPasswordValidator,
  signInValidator,
  validateReqiest,
} from '@/validations';
import { Request, Response, Router } from 'express';
import { authenticated } from '@/middlewers';

const router = Router();

router.post('/sign-in', validateReqiest(signInValidator), signInUser);
router.post('/log-in', validateReqiest(logInValidator), logInUser);

router.get('/check-auth', authenticated(), (req: Request, res: Response) => {
  res.send('yee..');
});

router.post('/forgot-password', validateReqiest(forgotPasswordValidator), forgotPassword);

router.post('/reset-password/:passwordResteToken', validateReqiest(resetPasswordValidator), resetPassword);

export { router as authRouter };
