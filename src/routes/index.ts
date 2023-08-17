import organizationRouter from "./department.route";
import staffStateRoutes from "./staff_state.route";
import roleRoutes from "./role.route";
import warehouseRoutes from "./warehouse.route";
import warehouseStateRoutes from "./warehouse_state.route";
import staffRoutes from "./staff.route";
import loginRoutes from "./login.route";
import paymentMethodRoutes from "./payment_method.route";
import serviceRoutes from "./service.route";
import userLevelRoutes from "./user_level.route";
import regionalDivisionRoutes from "./regional_division.route";
import subsidiaryRoutes from "./subsidiary.route";
import userStateRoutes from "./user_state.route";
import userRoutes from "./user.route";
import homeRoutes from "./home.route";
import aosWarehouseRoutes from './aos_warehouse.route'

export default (app) => {
  app.use("/", organizationRouter);
  app.use("/", staffStateRoutes);
  app.use("/", roleRoutes);
  app.use("/", warehouseRoutes);
  app.use("/", warehouseStateRoutes);
  app.use("/", staffRoutes);
  app.use("/", loginRoutes);
  app.use("/", paymentMethodRoutes);
  app.use("/", serviceRoutes);
  app.use("/", userLevelRoutes);
  app.use("/", regionalDivisionRoutes);
  app.use("/", subsidiaryRoutes);
  app.use("/", userStateRoutes);
  app.use("/", userRoutes);
  app.use("/", homeRoutes);
  app.use("/", aosWarehouseRoutes);
  app.get("/api/v1", (req, res) => res.sendStatus(200));
};
