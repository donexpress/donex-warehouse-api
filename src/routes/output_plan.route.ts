import express from 'express';
import { OutputPlanController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/output_plan',
  verifyTokenPresent,
  OutputPlanController.index
);
router.get('/api/v1/output_plan/count', OutputPlanController.count);
router.get('/api/v1/output_plan/states', OutputPlanController.listStates);
router.get('/api/v1/output_plan/destinations', verifyTokenPresent, OutputPlanController.destinations);
router.get('/api/v1/output_plan/addresses', verifyTokenPresent, OutputPlanController.addresses);
router.get('/api/v1/output_plan/:id', OutputPlanController.show);
router.post(
  '/api/v1/output_plan',
  verifyTokenPresent,
  OutputPlanController.create
);
router.post(
  '/api/v1/output_plan/filter',
  verifyTokenPresent,
  OutputPlanController.getByFilter
);
router.put(
  '/api/v1/output_plan/:id',
  verifyTokenPresent,
  OutputPlanController.update
);
router.delete(
  '/api/v1/output_plan/:id',
  verifyTokenPresent,
  OutputPlanController.remove
);

export default router;
