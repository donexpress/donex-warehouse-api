import express from 'express';
import { RoleController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get('/api/v1/role', verifyTokenPresent, RoleController.index);
router.get('/api/v1/role/count', RoleController.count);
router.get('/api/v1/role/:id', RoleController.show);
router.post('/api/v1/role', verifyTokenPresent, RoleController.create);
router.put('/api/v1/role/:id', verifyTokenPresent, RoleController.update);
router.delete('/api/v1/role/:id', verifyTokenPresent, RoleController.remove);

export default router;
