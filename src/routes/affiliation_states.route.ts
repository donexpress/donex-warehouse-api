import express from 'express';
import { AffiliationStateController } from '../controllers';
const router = express.Router();

router.get('/api/v1/affiliation_state', AffiliationStateController.index);
router.get('/api/v1/affiliation_state/count', AffiliationStateController.count);
router.get('/api/v1/affiliation_state/:id', AffiliationStateController.show);
router.post('/api/v1/affiliation_state', AffiliationStateController.create);
router.put('/api/v1/affiliation_state/:id', AffiliationStateController.update);
router.delete('/api/v1/affiliation_state/:id', AffiliationStateController.remove);

export default router;
