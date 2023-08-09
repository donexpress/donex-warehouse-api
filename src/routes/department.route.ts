import express from 'express';
import { DepartmentController } from '../controllers';
const router = express.Router();

router.get('/api/v1/department', DepartmentController.index);
router.get('/api/v1/department/count', DepartmentController.count);
router.get('/api/v1/department/:id', DepartmentController.show);
router.post('/api/v1/department', DepartmentController.create);
router.put('/api/v1/department/:id', DepartmentController.update);
router.delete('/api/v1/department/:id', DepartmentController.remove);

export default router;
