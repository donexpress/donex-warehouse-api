import express from 'express';
import { ManifestController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.post('/api/v1/manifest', verifyTokenPresent, ManifestController.create);
router.get('/api/v1/carrier', verifyTokenPresent, ManifestController.listCarriers);
router.get('/api/v1/manifest', verifyTokenPresent, ManifestController.find);

export default router;
