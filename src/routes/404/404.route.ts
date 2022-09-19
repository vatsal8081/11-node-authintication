import { notFound } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.all('*', notFound);

export { router as notFoundRouter };
