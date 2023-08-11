import express from 'express';
import { WarehouseStateController } from '../controllers';
const router = express.Router();

router.get('/api/v1/warehouse_state', WarehouseStateController.index);
router.get('/api/v1/warehouse_state/count', WarehouseStateController.count);
router.get('/api/v1/warehouse_state/:id', WarehouseStateController.show);
router.post('/api/v1/warehouse_state', WarehouseStateController.create);
router.put('/api/v1/warehouse_state/:id', WarehouseStateController.update);
router.delete('/api/v1/warehouse_state/:id', WarehouseStateController.remove);

export default router;
