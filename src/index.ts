import 'dotenv/config'
import express, { Express } from 'express';
import morgan from 'morgan';
import { AppDataSource } from "./config/ormconfig"
import { AffiliationRoutes, AffiliationStateRoutes, DeparmentRoutes, RoleRoutes, UserRoutes, UserStateRoutes } from './routes';


const app: Express = express();
const PORT = process.env.PORT ?? 3000

/** Midlewares */
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}))
app.use(express.json())


AppDataSource.initialize().then(() => {
    console.log(`Database sync successfully`)
}).catch(error => console.log(error))

/** Routes */
app.use('/', DeparmentRoutes.default);
app.use('/', UserStateRoutes.default);
app.use('/', RoleRoutes.default);
app.use('/', AffiliationRoutes.default);
app.use('/', AffiliationStateRoutes.default);
app.use('/', UserStateRoutes.default);
app.use('/', UserRoutes.default);

app.get('/api/v1', (req, res) => res.sendStatus(200));

app.listen(PORT, ()=> {
    console.log(`Service running on port: ${PORT}`)
})





