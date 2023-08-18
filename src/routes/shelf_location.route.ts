import express from "express";
import { ShelfLocation } from "../controllers";
import { verifyTokenPresent } from "../middlewares";
const router = express.Router();

router.get("/api/v1/shelf_location",verifyTokenPresent, ShelfLocation.index);
router.get("/api/v1/shelf_location/count", ShelfLocation.count);
router.get("/api/v1/shelf_location/:id", ShelfLocation.show);
router.post("/api/v1/shelf_location", ShelfLocation.create);
router.put("/api/v1/shelf_location/:id", ShelfLocation.update);
router.delete("/api/v1/shelf_location/:id",verifyTokenPresent, ShelfLocation.remove);

export default router;
