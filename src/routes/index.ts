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
import aosWarehouseRoutes from './aos_warehouse.route';
import shelfBillingType from './shelf_billing_type.route';
import shelfLocation from './shelf_location.route';
import shelfType from './shelf_type.route';
import shelf from './shelf.route';
import packingList from './packing_list.route'
import storagePlan from './storage_plan.route'
import lineClassification from './line_classification.route'
import outputPlan from './output_plan.route'

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
  app.use("/", shelfBillingType);
  app.use("/", shelfLocation);
  app.use("/", shelfType);
  app.use("/", shelf);
  app.use("/", packingList);
  app.use("/", storagePlan);
  app.use("/", lineClassification);
  app.use("/", outputPlan);
  app.get("/api/v1", (req, res) => res.sendStatus(200));
};
