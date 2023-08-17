import express from "express";
import { WarehouseStateController } from "../controllers";
import { verifyTokenPresent } from "../middlewares";
const router = express.Router();

router.get(
  "/api/v1/cargo_station_state",
  verifyTokenPresent,
  WarehouseStateController.index
);
router.get("/api/v1/cargo_station_state/count", WarehouseStateController.count);
router.get("/api/v1/cargo_station_state/:id", WarehouseStateController.show);
router.post("/api/v1/cargo_station_state", WarehouseStateController.create);
router.put("/api/v1/cargo_station_state/:id", WarehouseStateController.update);
router.delete(
  "/api/v1/cargo_station_state/:id",
  verifyTokenPresent,
  WarehouseStateController.remove
);

export default router;
