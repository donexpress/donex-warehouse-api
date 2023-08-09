import express from 'express';
import { UserController } from '../controllers';
const router = express.Router();

router.get('/api/v1/user', UserController.index);
router.get('/api/v1/user/count', UserController.count);
router.get('/api/v1/user/:id', UserController.show);
router.post('/api/v1/user', UserController.create);
router.put('/api/v1/user/:id', UserController.update);
router.delete('/api/v1/user/:id', UserController.remove);

export default router;
