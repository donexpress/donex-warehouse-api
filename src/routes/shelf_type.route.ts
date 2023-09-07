import express from 'express';
import { ShelfTypeController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get('/api/v1/shelf_type', verifyTokenPresent, ShelfTypeController.index);
router.get('/api/v1/shelf_type/count', ShelfTypeController.count);
router.get('/api/v1/shelf_type/:id', ShelfTypeController.show);
router.post(
  '/api/v1/shelf_type',
  verifyTokenPresent,
  ShelfTypeController.create
);
router.put(
  '/api/v1/shelf_type/:id',
  verifyTokenPresent,
  ShelfTypeController.update
);
router.delete(
  '/api/v1/shelf_type/:id',
  verifyTokenPresent,
  ShelfTypeController.remove
);

export default router;
