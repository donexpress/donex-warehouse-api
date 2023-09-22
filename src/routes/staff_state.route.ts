import express from 'express';
import { StaffStateController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/staff_state',
  verifyTokenPresent,
  StaffStateController.index
);

export default router;
