import express from "express";
import { ShelfType } from "../controllers";
import { verifyTokenPresent } from "../middlewares";
const router = express.Router();

router.get("/api/v1/shelf_type",verifyTokenPresent, ShelfType.index);
router.get("/api/v1/shelf_type/count", ShelfType.count);
router.get("/api/v1/shelf_type/:id", ShelfType.show);
router.post("/api/v1/shelf_type", ShelfType.create);
router.put("/api/v1/shelf_type/:id", ShelfType.update);
router.delete("/api/v1/shelf_type/:id",verifyTokenPresent, ShelfType.remove);

export default router;
