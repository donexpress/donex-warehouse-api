import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { AppDataSource } from './config/ormconfig';
import routeInstantiator from './routes';
import { appMode } from './config/app';
import { LoggerMiddleware, verifyTokenPresent } from './middlewares';

const app: Express = express();
const PORT = process.env.PORT ?? 3000;

/** Midlewares */

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(LoggerMiddleware);

if (appMode() === 'api') {
  routeInstantiator(app);
}

AppDataSource.initialize()
  .then(() => {
    console.log(`Database sync successfully`);
  })
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Service running on port: ${PORT}`);
});
