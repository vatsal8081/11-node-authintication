import { connect, connection } from 'mongoose';
import { Envormrnt } from '@/config';

const connectToDb = async () => {
  const dbUrl = Envormrnt.MONGO_DB_CONNECTION_STRING;

  try {
    await connect(dbUrl);
    console.log(`Mongoose connection open at ${dbUrl}`);
  } catch (err) {
    console.log('Not able to connect to DB.', err);
  }

  connection.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
  });

  connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected');
  });
};

export { connectToDb };
