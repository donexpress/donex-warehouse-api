import express from 'express';
import { LineClassificationController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/line_classification',
  verifyTokenPresent,
  LineClassificationController.index
);
router.get(
  '/api/v1/line_classification/count',
  LineClassificationController.count
);
router.get(
  '/api/v1/line_classification/:id',
  LineClassificationController.show
);
router.post('/api/v1/line_classification', LineClassificationController.create);
router.put(
  '/api/v1/line_classification/:id',
  LineClassificationController.update
);
router.delete(
  '/api/v1/line_classification/:id',
  verifyTokenPresent,
  LineClassificationController.remove
);

export default router;
