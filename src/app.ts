import express, { Express } from 'express';
import { configEnv, Envormrnt, connectToDb, startServer } from '@/config';
import { registerCustome404, router } from '@/routes';
import { ApiEndPoint } from './enums';
import helmet from 'helmet';
import expressMongoSenitize from 'express-mongo-sanitize';
// import xssClean from 'xss-clean';

// name, email, contact, pass, passLastUpdated
configEnv();
connectToDb();

const app: Express = express();
const port = Envormrnt.PORT;

app.use(helmet());
// app.use(xssClean());

app.use(express.json());
app.use(expressMongoSenitize());

app.use(ApiEndPoint.PREFIX, router);
registerCustome404(app);

startServer(app, port);
