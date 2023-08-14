import express from 'express';
import { ServiceController } from '../controllers';
const router = express.Router();

router.get('/api/v1/service', ServiceController.index);
router.get('/api/v1/service/count', ServiceController.count);
router.get('/api/v1/service/:id', ServiceController.show);
router.post('/api/v1/service', ServiceController.create);
router.put('/api/v1/service/:id', ServiceController.update);
router.delete('/api/v1/service/:id', ServiceController.remove);

export default router;