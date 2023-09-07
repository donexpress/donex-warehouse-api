import express from 'express';
import { PaymentMethodController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/payment_method',
  verifyTokenPresent,
  PaymentMethodController.index
);
router.get('/api/v1/payment_method/count', PaymentMethodController.count);
router.get('/api/v1/payment_method/:id', PaymentMethodController.show);
router.post(
  '/api/v1/payment_method',
  verifyTokenPresent,
  PaymentMethodController.create
);
router.put(
  '/api/v1/payment_method/:id',
  verifyTokenPresent,
  PaymentMethodController.update
);
router.delete(
  '/api/v1/payment_method/:id',
  verifyTokenPresent,
  PaymentMethodController.remove
);

export default router;
