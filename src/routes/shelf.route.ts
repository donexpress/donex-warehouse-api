import express from 'express';
import { ShelfController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get('/api/v1/shelf', verifyTokenPresent, ShelfController.index);
router.get('/api/v1/shelf/count', ShelfController.count);
router.get('/api/v1/shelf/:id', ShelfController.show);
router.post('/api/v1/shelf', ShelfController.create);
router.put('/api/v1/shelf/:id', ShelfController.update);
router.delete('/api/v1/shelf/:id', verifyTokenPresent, ShelfController.remove);

export default router;
