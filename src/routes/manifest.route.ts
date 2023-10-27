import express from 'express';
import { ManifestController } from '../controllers';
import { guardianMw, verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.post(
  '/api/v1/manifest',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.create
);
router.get(
  '/api/v1/carriers',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.listCarriers
);
router.get(
  '/api/v1/manifest',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.find
);

export default router;
