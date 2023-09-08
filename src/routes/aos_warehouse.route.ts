import express from 'express';
import { AOSWarehouseController } from '../controllers';
import { verifyTokenPresent, guardianMw } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/aos_warehouse',
  verifyTokenPresent,
  AOSWarehouseController.index
);
router.get('/api/v1/aos_warehouse/count', AOSWarehouseController.count);
router.get('/api/v1/aos_warehouse/:id', AOSWarehouseController.show);
router.post('/api/v1/aos_warehouse', AOSWarehouseController.create);
router.put(
  '/api/v1/aos_warehouse/:id',
  verifyTokenPresent,
  AOSWarehouseController.update
);
router.delete(
  '/api/v1/aos_warehouse/:id',
  verifyTokenPresent,
  AOSWarehouseController.remove
);

export default router;
