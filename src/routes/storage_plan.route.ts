import express from 'express';
import { StoragePlan } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get('/api/v1/storage_plan', verifyTokenPresent, StoragePlan.index);
router.get('/api/v1/storage_plan/count', StoragePlan.count);
router.get('/api/v1/storage_plan/:id', StoragePlan.show);
router.post('/api/v1/storage_plan', verifyTokenPresent, StoragePlan.create);
router.put('/api/v1/storage_plan/:id', StoragePlan.update);
router.delete(
  '/api/v1/storage_plan/:id',
  verifyTokenPresent,
  StoragePlan.remove
);

export default router;
