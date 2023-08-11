import express from 'express';
import { DepartmentController } from '../controllers';
const router = express.Router();

router.get('/api/v1/organization', DepartmentController.index);
router.get('/api/v1/organization/count', DepartmentController.count);
router.get('/api/v1/organization/:id', DepartmentController.show);
router.post('/api/v1/organization', DepartmentController.create);
router.put('/api/v1/organization/:id', DepartmentController.update);
router.delete('/api/v1/organization/:id', DepartmentController.remove);

export default router;
