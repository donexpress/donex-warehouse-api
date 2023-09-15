import express from 'express';
import { StoragePlanStateController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/storage_plan_state',
  verifyTokenPresent,
  StoragePlanStateController.index
);
/* router.get(
  '/api/v1/storage_plan_state/count',
  StoragePlanStateController.count
);
router.get('/api/v1/storage_plan_state/:id', StoragePlanStateController.show);
router.post(
  '/api/v1/storage_plan_state',
  verifyTokenPresent,
  verifyTokenPresent,
  StoragePlanStateController.create
);
router.put(
  '/api/v1/storage_plan_state/:id',
  verifyTokenPresent,
  StoragePlanStateController.update
);
router.delete(
  '/api/v1/storage_plan_state/:id',
  verifyTokenPresent,
  StoragePlanStateController.remove
); */

export default router;
