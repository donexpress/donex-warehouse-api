import express from 'express';
import { OperationInstructionController } from '../controllers';
import { verifyTokenPresent } from '../middlewares';
const router = express.Router();

router.get(
  '/api/v1/operation_instruction/type/list',
  OperationInstructionController.listOperationInstructionType
);
router.get(
  '/api/v1/operation_instruction',
  verifyTokenPresent,
  OperationInstructionController.index
);
router.get(
  '/api/v1/operation_instruction/states',
  verifyTokenPresent,
  OperationInstructionController.states
);
router.get(
  '/api/v1/operation_instruction/output_plan/:outputPlanId',
  verifyTokenPresent,
  OperationInstructionController.indexByOutputPlan
);
router.get(
  '/api/v1/operation_instruction/count',
  OperationInstructionController.count
);
router.get(
  '/api/v1/operation_instruction/:id',
  OperationInstructionController.show
);
router.post(
  '/api/v1/operation_instruction',
  verifyTokenPresent,
  OperationInstructionController.create
);
router.put(
  '/api/v1/operation_instruction/:id',
  verifyTokenPresent,
  OperationInstructionController.update
);
router.delete(
  '/api/v1/operation_instruction/:id',
  verifyTokenPresent,
  OperationInstructionController.remove
);

export default router;
