import express from 'express';
import { PackingList } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get('/api/v1/packing_list', verifyTokenPresent, PackingList.index);
router.get('/api/v1/packing_list/count', PackingList.count);
router.get('/api/v1/packing_list/:id', PackingList.show);
router.post('/api/v1/packing_list', PackingList.create);
router.put('/api/v1/packing_list/:id', PackingList.update);
router.delete(
  '/api/v1/packing_list/:id',
  verifyTokenPresent,
  PackingList.remove
);

export default router;
