import express from 'express';
import { WarehouseStateController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/cargo_station_state',
  verifyTokenPresent,
  WarehouseStateController.index
);

export default router;
