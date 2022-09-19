import { config } from 'dotenv';

const configEnv = () => config();

const Envormrnt = process.env;

export { configEnv, Envormrnt };
