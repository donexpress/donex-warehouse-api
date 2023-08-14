import express from 'express';
import { SubsidiaryController } from '../controllers';
const router = express.Router();

router.get('/api/v1/subsidiary', SubsidiaryController.index);
router.get('/api/v1/subsidiary/count', SubsidiaryController.count);
router.get('/api/v1/subsidiary/:id', SubsidiaryController.show);
router.post('/api/v1/subsidiary', SubsidiaryController.create);
router.put('/api/v1/subsidiary/:id', SubsidiaryController.update);
router.delete('/api/v1/subsidiary/:id', SubsidiaryController.remove);

export default router;
