import { Router, Express } from 'express';
import { notFoundRouter } from '@/routes/404/404.route';
import { authRouter } from '@/routes/auth/auth.route';

const router = Router();

router.use('/auth', authRouter);

// this should be last entry in router
const registerCustome404 = (app: Express) => app.use(notFoundRouter);

export { router, registerCustome404 };
