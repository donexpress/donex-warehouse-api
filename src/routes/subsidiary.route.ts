import express from 'express';
import { SubsidiaryController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/subsidiary',
  verifyTokenPresent,
  SubsidiaryController.index
);
router.get('/api/v1/subsidiary/count', SubsidiaryController.count);
router.get('/api/v1/subsidiary/states', SubsidiaryController.states);
router.get('/api/v1/subsidiary/:id', SubsidiaryController.show);
router.post(
  '/api/v1/subsidiary',
  verifyTokenPresent,
  SubsidiaryController.create
);
router.put(
  '/api/v1/subsidiary/:id',
  verifyTokenPresent,
  SubsidiaryController.update
);
router.delete(
  '/api/v1/subsidiary/:id',
  verifyTokenPresent,
  SubsidiaryController.remove
);

export default router;
