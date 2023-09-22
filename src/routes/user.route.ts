import express from 'express';
import { UserController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/user',
  verifyTokenPresent,
  UserController.index
);
router.get('/api/v1/user/count', UserController.count);
router.get('/api/v1/user/states', UserController.listStates);
router.get('/api/v1/user/:id', UserController.show);
router.post('/api/v1/user', verifyTokenPresent, UserController.create);
router.put('/api/v1/user/:id', verifyTokenPresent, UserController.update);
router.delete('/api/v1/user/:id', verifyTokenPresent, UserController.remove);

export default router;
