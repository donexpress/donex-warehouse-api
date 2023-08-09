import express from 'express';
import { UserStateController } from '../controllers';
const router = express.Router();

router.get('/api/v1/user_state', UserStateController.index);
router.get('/api/v1/user_state/count', UserStateController.count);
router.get('/api/v1/user_state/:id', UserStateController.show);
router.post('/api/v1/user_state', UserStateController.create);
router.put('/api/v1/user_state/:id', UserStateController.update);
router.delete('/api/v1/user_state/:id', UserStateController.remove);

export default router;
