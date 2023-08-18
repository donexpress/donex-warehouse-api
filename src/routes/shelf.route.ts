import express from "express";
import { Shelf } from "../controllers";
import { verifyTokenPresent } from "../middlewares";
const router = express.Router();

router.get("/api/v1/shelf",verifyTokenPresent, Shelf.index);
router.get("/api/v1/shelf/count", Shelf.count);
router.get("/api/v1/shelf/:id", Shelf.show);
router.post("/api/v1/shelf", Shelf.create);
router.put("/api/v1/shelf/:id", Shelf.update);
router.delete("/api/v1/shelf/:id",verifyTokenPresent, Shelf.remove);

export default router;
