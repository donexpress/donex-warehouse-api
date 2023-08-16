import express from "express";
import { WarehouseController } from "../controllers";
import { verifyTokenPresent } from "../middlewares";
const router = express.Router();

router.get("/api/v1/warehouse", verifyTokenPresent, WarehouseController.index);
router.get("/api/v1/warehouse/count", WarehouseController.count);
router.get("/api/v1/warehouse/:id", WarehouseController.show);
router.post("/api/v1/warehouse", WarehouseController.create);
router.put("/api/v1/warehouse/:id", WarehouseController.update);
router.delete(
  "/api/v1/warehouse/:id",
  verifyTokenPresent,
  WarehouseController.remove
);

export default router;
