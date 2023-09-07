import express from 'express';
import { FileController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.post('/api/v1/file', verifyTokenPresent, FileController.upload_file);
router.delete('/api/v1/file', verifyTokenPresent, FileController.remove_file);

export default router;
