import express, { Request, Response } from 'express';
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

router.get(
  '/api/v1/sum',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.sum
);

router.get(
  '/api/v1/excel',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.jsonToxlsx
);

router.post(
  '/api/v1/shipping_invoice',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.xlsxBill
);

router.get(
  '/api/v1/count',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.count
);

router.get(
  '/api/v1/byWaybill',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.byWaybill
);

router.get(
  '/api/v1/supplier_invoice',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.supplier_invoice
);

router.patch(
  '/api/v1/paid',
  verifyTokenPresent,
  //guardianMw(['ADMIN', 'FINANCE']),
  ManifestController.paidUpdate
);

export default router;
