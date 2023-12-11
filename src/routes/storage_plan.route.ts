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
router.get('/api/v1/storage_plan/:id/no_dependencies', StoragePlanController.no_dependencies);
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
router.post(
  '/api/v1/storage_plan/:id/auto_assign',
  verifyTokenPresent,
  StoragePlanController.auto_assign
);
router.post(
  '/api/v1/storage_plan/:id/suggest_asign',
  verifyTokenPresent,
  StoragePlanController.suggested
);
router.put(
  '/api/v1/storage_plan/:id',
  verifyTokenPresent,
  StoragePlanController.update
);
router.patch(
  '/api/v1/storage_plan/:id/change_state',
  verifyTokenPresent,
  StoragePlanController.changeState
);
router.delete(
  '/api/v1/storage_plan/:id',
  verifyTokenPresent,
  StoragePlanController.remove
);

export default router;
