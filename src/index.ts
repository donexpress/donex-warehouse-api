import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import { AppDataSource } from "./config/ormconfig";
import {
  WarehouseRoutes,
  WarehouseStateRoutes,
  OrganizationRoutes,
  LoginRoutes,
  RoleRoutes,
  StaffRoutes,
  StaffStateRoutes,
  PaymentMethodRoutes,
  ServiceRoutes,
  UserLevelRoutes,
  HomeRoutes,
} from "./routes";

const app: Express = express();
const PORT = process.env.PORT ?? 3000;

/** Midlewares */
app.use(cors())
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log(`Database sync successfully`);
  })
  .catch((error) => console.log(error));

/** Routes */
app.use("/", OrganizationRoutes.default);
app.use("/", StaffStateRoutes.default);
app.use("/", RoleRoutes.default);
app.use("/", WarehouseRoutes.default);
app.use("/", WarehouseStateRoutes.default);
app.use("/", StaffStateRoutes.default);
app.use("/", StaffRoutes.default);
app.use("/", LoginRoutes.default);
app.use("/", PaymentMethodRoutes.default);
app.use("/", ServiceRoutes.default);
app.use("/", UserLevelRoutes.default);
app.use("/", HomeRoutes.default);

app.get("/api/v1", (req, res) => res.sendStatus(200));

app.listen(PORT, () => {
  console.log(`Service running on port: ${PORT}`);
});
