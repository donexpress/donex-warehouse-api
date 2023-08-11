import express from 'express';
import { StaffStateController } from '../controllers';
const router = express.Router();

router.get('/api/v1/staff_state', StaffStateController.index);
router.get('/api/v1/staff_state/count', StaffStateController.count);
router.get('/api/v1/staff_state/:id', StaffStateController.show);
router.post('/api/v1/staff_state', StaffStateController.create);
router.put('/api/v1/staff_state/:id', StaffStateController.update);
router.delete('/api/v1/staff_state/:id', StaffStateController.remove);

export default router;
