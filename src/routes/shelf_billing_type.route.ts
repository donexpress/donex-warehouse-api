import express from "express";
import { ShelfBillingType } from "../controllers";
import { verifyTokenPresent } from "../middlewares";
const router = express.Router();

router.get("/api/v1/shelf_billing_type",verifyTokenPresent, ShelfBillingType.index);
router.get("/api/v1/shelf_billing_type/count", ShelfBillingType.count);
router.get("/api/v1/shelf_billing_type/:id", ShelfBillingType.show);
router.post("/api/v1/shelf_billing_type", ShelfBillingType.create);
router.put("/api/v1/shelf_billing_type/:id", ShelfBillingType.update);
router.delete("/api/v1/shelf_billing_type/:id",verifyTokenPresent, ShelfBillingType.remove);

export default router;
