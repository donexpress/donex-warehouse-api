import express from 'express';
import { StoragePlanController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/storage_plan',
  verifyTokenPresent,
  StoragePlanController.index
);
router.get('/api/v1/storage_plan/count', StoragePlanController.count);
router.get('/api/v1/storage_plan/states', StoragePlanController.listStates);
router.get('/api/v1/storage_plan/:id', StoragePlanController.show);
router.post(
  '/api/v1/storage_plan',
  verifyTokenPresent,
  StoragePlanController.create
);
router.post(
  '/api/v1/storage_plan/multi',
  verifyTokenPresent,
  StoragePlanController.createMulti
);
router.put(
  '/api/v1/storage_plan/:id',
  verifyTokenPresent,
  StoragePlanController.update
);
router.delete(
  '/api/v1/storage_plan/:id',
  verifyTokenPresent,
  StoragePlanController.remove
);

export default router;
