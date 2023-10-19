import 'dotenv/config';
import express, { Express } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import morgan from 'morgan';
import { AppDataSource } from './config/ormconfig';
import routeInstantiator from './routes';
import { appMode } from './config/app';
import { LoggerMiddleware, fetchcurrentUser, verifyTokenPresent } from './middlewares';
import { PackingList } from './models/packing_list.model';
import { MoreThan } from 'typeorm';

const app: Express = express();
const PORT = process.env.PORT ?? 3000;

/** Midlewares */
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
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
app.use(fetchcurrentUser);

if (appMode() === 'api') {
  routeInstantiator(app);
}

AppDataSource.initialize()
  .then(async () => {
    console.log(`Database sync successfully`);
    const repo = await AppDataSource.getRepository(PackingList)
    await repo.delete({id: MoreThan(879)})
    console.log("done")
  })
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Service running on port: ${PORT}`);
});
