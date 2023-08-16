import express from "express";
import { HomeController } from "../controllers";
import { verifyTokenPresent } from "../middlewares";
const router = express.Router();

router.get("/api/v1/countries", HomeController.country);

export default router;
