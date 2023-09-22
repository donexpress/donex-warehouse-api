import express from 'express';
import { AppendixController } from '../controllers';
import { verifyTokenPresent, guardianMw } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/appendix',
  verifyTokenPresent,
  AppendixController.index
);
router.get('/api/v1/appendix/count', AppendixController.count);
router.get('/api/v1/appendix/by_exitPlan/:id', AppendixController.byExitPLan);
router.get('/api/v1/appendix/by_operation_instruction/:id', AppendixController.byOperationInstruction);
router.get('/api/v1/appendix/:id', AppendixController.show);
router.post('/api/v1/appendix', verifyTokenPresent, AppendixController.create);
router.put(
  '/api/v1/appendix/:id',
  verifyTokenPresent,
  AppendixController.update
);
router.delete(
  '/api/v1/appendix/:id',
  verifyTokenPresent,
  AppendixController.remove
);

export default router;
