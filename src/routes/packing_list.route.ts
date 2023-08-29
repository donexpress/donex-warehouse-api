import express from 'express';
import { PackingListController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/packing_list',
  verifyTokenPresent,
  PackingListController.index
);
router.get('/api/v1/packing_list/count', PackingListController.count);
router.get('/api/v1/packing_list/:id', PackingListController.show);
router.post('/api/v1/packing_list', PackingListController.create);
router.put('/api/v1/packing_list/:id', PackingListController.update);
router.delete(
  '/api/v1/packing_list/:id',
  verifyTokenPresent,
  PackingListController.remove
);

export default router;
