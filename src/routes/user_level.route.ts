import express from 'express';
import { UserLevelController } from '../controllers';
const router = express.Router();

router.get('/api/v1/user_level', UserLevelController.index);
router.get('/api/v1/user_level/count', UserLevelController.count);
router.get('/api/v1/user_level/:id', UserLevelController.show);
router.post('/api/v1/user_level', UserLevelController.create);
router.put('/api/v1/user_level/:id', UserLevelController.update);
router.delete('/api/v1/user_level/:id', UserLevelController.remove);

export default router;
