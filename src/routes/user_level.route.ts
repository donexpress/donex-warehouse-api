import express from 'express';
import { UserLevelController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get('/api/v1/user_level', verifyTokenPresent, UserLevelController.index);
router.get('/api/v1/user_level/count', UserLevelController.count);
router.get('/api/v1/user_level/:id', UserLevelController.show);
router.post(
  '/api/v1/user_level',
  verifyTokenPresent,
  UserLevelController.create
);
router.put(
  '/api/v1/user_level/:id',
  verifyTokenPresent,
  UserLevelController.update
);
router.delete(
  '/api/v1/user_level/:id',
  verifyTokenPresent,
  UserLevelController.remove
);

export default router;
