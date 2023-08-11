import express from 'express';
import { StaffController } from '../controllers';
const router = express.Router();

router.get('/api/v1/staff', StaffController.index);
router.get('/api/v1/staff/count', StaffController.count);
router.get('/api/v1/staff/:id', StaffController.show);
router.post('/api/v1/staff', StaffController.create);
router.put('/api/v1/staff/:id', StaffController.update);
router.delete('/api/v1/staff/:id', StaffController.remove);

export default router;
