import express from 'express';
import { UserStateController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get('/api/v1/user_state', verifyTokenPresent, UserStateController.index);
router.get('/api/v1/user_state/count', UserStateController.count);
router.get('/api/v1/user_state/:id', UserStateController.show);
router.post('/api/v1/user_state', verifyTokenPresent, UserStateController.create);
router.put('/api/v1/user_state/:id', verifyTokenPresent, UserStateController.update);
router.delete('/api/v1/user_state/:id', verifyTokenPresent, UserStateController.remove);

export default router;
