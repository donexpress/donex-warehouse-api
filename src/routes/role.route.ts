import express from 'express';
import { RoleController } from '../controllers';
const router = express.Router();

router.get('/api/v1/role', RoleController.index);
router.get('/api/v1/role/count', RoleController.count);
router.get('/api/v1/role/:id', RoleController.show);
router.post('/api/v1/role', RoleController.create);
router.put('/api/v1/role/:id', RoleController.update);
router.delete('/api/v1/role/:id', RoleController.remove);

export default router;
