import express from 'express';
import { ShelfBillingTypeController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/shelf_billing_type',
  verifyTokenPresent,
  ShelfBillingTypeController.index
);
router.get(
  '/api/v1/shelf_billing_type/count',
  ShelfBillingTypeController.count
);
router.get('/api/v1/shelf_billing_type/:id', ShelfBillingTypeController.show);
router.post('/api/v1/shelf_billing_type', ShelfBillingTypeController.create);
router.put('/api/v1/shelf_billing_type/:id', ShelfBillingTypeController.update);
router.delete(
  '/api/v1/shelf_billing_type/:id',
  verifyTokenPresent,
  ShelfBillingTypeController.remove
);

export default router;
