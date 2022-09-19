import { HttpStatus } from '@/enums';
import { sendOperationalErrorResponse } from '@/responses';
import { Express, Request, Response, NextFunction } from 'express';

const startServer = (app: Express, port: number) => {
  app.listen(port, () => console.log(`server is running at http://localhost:${port}`));

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return sendOperationalErrorResponse(res, err, HttpStatus.INTERNAL_SERVER_ERR);
  });

  process.on('unhandledRejection', (reason: string, promise: Promise<any>) => {
    console.log(`---------------------- UNHANDEL PROMISE REJECTION ------------------`);
    console.log(`reason: ${reason} AT---- ${promise}`);
    console.log(`---------------------- UNHANDEL PROMISE REJECTION ------------------`);
  });

  process.on('uncaughtException', (error: Error) => {
    console.log(`---------------------- UN CAUGHT EXCEPTION ------------------`);
    console.log(error);
    console.log(`---------------------- UN CAUGHT EXCEPTION ------------------`);
  });
};

export { startServer };
