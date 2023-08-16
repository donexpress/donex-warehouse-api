import express from "express";
import { HomeController } from "../controllers";
const router = express.Router();

router.get("/api/v1/countries", HomeController.country);

export default router;
