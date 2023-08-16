import express from "express";
import { StaffStateController } from "../controllers";
import { verifyTokenPresent } from "../middlewares";
const router = express.Router();

router.get(
  "/api/v1/staff_state",
  verifyTokenPresent,
  StaffStateController.index
);
router.get("/api/v1/staff_state/count", StaffStateController.count);
router.get("/api/v1/staff_state/:id", StaffStateController.show);
router.post("/api/v1/staff_state", StaffStateController.create);
router.put("/api/v1/staff_state/:id", StaffStateController.update);
router.delete(
  "/api/v1/staff_state/:id",
  verifyTokenPresent,
  StaffStateController.remove
);

export default router;
