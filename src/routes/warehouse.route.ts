import express from "express";
import { WarehouseController } from "../controllers";
import { verifyTokenPresent } from "../middlewares";
const router = express.Router();

router.get("/api/v1/cargo_station", verifyTokenPresent, WarehouseController.index);
router.get("/api/v1/cargo_station/count", WarehouseController.count);
router.get("/api/v1/cargo_station/:id", WarehouseController.show);
router.post("/api/v1/cargo_station", WarehouseController.create);
router.put("/api/v1/cargo_station/:id", WarehouseController.update);
router.delete(
  "/api/v1/cargo_station/:id",
  verifyTokenPresent,
  WarehouseController.remove
);

export default router;
