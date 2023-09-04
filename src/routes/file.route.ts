import express from "express";
import { FileController } from "../controllers";
const router = express.Router();

router.post("/api/v1/file", FileController.upload_file);
router.delete("/api/v1/file", FileController.remove_file);

export default router;
