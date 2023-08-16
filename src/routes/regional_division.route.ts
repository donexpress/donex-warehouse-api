import express from "express";
import { RegionalDivisionController } from "../controllers";
import { verifyTokenPresent } from "../middlewares";
const router = express.Router();

router.get(
  "/api/v1/regional_division",
  verifyTokenPresent,
  RegionalDivisionController.index
);
router.get("/api/v1/regional_division/count", RegionalDivisionController.count);
router.get("/api/v1/regional_division/:id", RegionalDivisionController.show);
router.post("/api/v1/regional_division", RegionalDivisionController.create);
router.put("/api/v1/regional_division/:id", RegionalDivisionController.update);
router.delete(
  "/api/v1/regional_division/:id",
  verifyTokenPresent,
  RegionalDivisionController.remove
);

export default router;
