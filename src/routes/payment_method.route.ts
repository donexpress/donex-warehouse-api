import express from 'express';
import { PaymentMethodController } from '../controllers';
const router = express.Router();

router.get('/api/v1/payment_method', PaymentMethodController.index);
router.get('/api/v1/payment_method/count', PaymentMethodController.count);
router.get('/api/v1/payment_method/:id', PaymentMethodController.show);
router.post('/api/v1/payment_method', PaymentMethodController.create);
router.put('/api/v1/payment_method/:id', PaymentMethodController.update);
router.delete('/api/v1/payment_method/:id', PaymentMethodController.remove);

export default router;
