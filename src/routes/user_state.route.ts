import express from 'express';
import { UserStateController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get('/api/v1/user_state', verifyTokenPresent, UserStateController.index);

export default router;
