import express from 'express';
import { RegionalDivisionController } from '../controllers';
const router = express.Router();

router.get('/api/v1/regional_division', RegionalDivisionController.index);
router.get('/api/v1/regional_division/count', RegionalDivisionController.count);
router.get('/api/v1/regional_division/:id', RegionalDivisionController.show);
router.post('/api/v1/regional_division', RegionalDivisionController.create);
router.put('/api/v1/regional_division/:id', RegionalDivisionController.update);
router.delete('/api/v1/regional_division/:id', RegionalDivisionController.remove);

export default router;
