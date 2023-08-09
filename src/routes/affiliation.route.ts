import express from 'express';
import { AffiliationController } from '../controllers';
const router = express.Router();

router.get('/api/v1/affiliation', AffiliationController.index);
router.get('/api/v1/affiliation/count', AffiliationController.count);
router.get('/api/v1/affiliation/:id', AffiliationController.show);
router.post('/api/v1/affiliation', AffiliationController.create);
router.put('/api/v1/affiliation/:id', AffiliationController.update);
router.delete('/api/v1/affiliation/:id', AffiliationController.remove);

export default router;
