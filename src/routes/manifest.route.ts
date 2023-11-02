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
router.patch(
  '/api/v1/manifest_customer',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.update_customer_do
);
router.patch(
  '/api/v1/manifest_supplier',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.update_supplier_do
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

router.delete(
  '/api/v1/manifest',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.remove
);

export default router;
