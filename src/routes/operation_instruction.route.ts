import express from 'express';
import { OperationInstruction } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/operation_instruction',
  verifyTokenPresent,
  OperationInstruction.index
);
router.get(
  '/api/v1/operation_instruction/:outputPlanId',
  verifyTokenPresent,
  OperationInstruction.indexByOutputPlan
);
router.get('/api/v1/operation_instruction/count', OperationInstruction.count);
router.get('/api/v1/operation_instruction/:id', OperationInstruction.show);
router.post(
  '/api/v1/operation_instruction',
  verifyTokenPresent,
  OperationInstruction.create
);
router.put(
  '/api/v1/operation_instruction/:id',
  verifyTokenPresent,
  OperationInstruction.update
);
router.delete(
  '/api/v1/operation_instruction/:id',
  verifyTokenPresent,
  OperationInstruction.remove
);
router.get(
  '/api/v1/operation_instruction/type',
  OperationInstruction.listOperationInstructionType
);

export default router;
