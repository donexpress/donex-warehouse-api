import express from 'express';
import { ShelfPackageController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get('/api/v1/shelf_package', verifyTokenPresent, ShelfPackageController.index);
router.get('/api/v1/shelf_package/count', ShelfPackageController.count);
router.get('/api/v1/shelf_package/:id', ShelfPackageController.show);
router.post('/api/v1/shelf_package', ShelfPackageController.create);
router.put('/api/v1/shelf_package/:id', ShelfPackageController.update);
router.delete('/api/v1/shelf_package/:id', verifyTokenPresent, ShelfPackageController.remove);

export default router;
