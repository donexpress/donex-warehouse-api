import express from 'express';
import { ShelfLocationController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/shelf_location',
  verifyTokenPresent,
  ShelfLocationController.index
);
router.get('/api/v1/shelf_location/count', ShelfLocationController.count);
router.get('/api/v1/shelf_location/:id', ShelfLocationController.show);
router.post(
  '/api/v1/shelf_location',
  verifyTokenPresent,
  ShelfLocationController.create
);
router.put(
  '/api/v1/shelf_location/:id',
  verifyTokenPresent,
  ShelfLocationController.update
);
router.delete(
  '/api/v1/shelf_location/:id',
  verifyTokenPresent,
  ShelfLocationController.remove
);

export default router;
