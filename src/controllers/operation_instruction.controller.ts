import { Request, Response } from 'express';
import {
  countOI,
  createOI,
  listOI,
  removeOI,
  showOI,
  updateOI,
  changeStatusOI,
  listOIByOutputPlanId,
  getOperationInstructionStates,
  getOperationInstructionTypes,
  countAllOI,
} from '../context/operation_instruction';
import { OperationInstruction } from '../models/instruction_operation.model';
import types from '../config/types';
import warehouse_type from '../config/types';
import { getCurrentUser } from '../middlewares';

export const listOperationInstructionType = async (
  req: Request,
  res: Response
) => {
  res.send(getOperationInstructionTypes());
};

export const index = async (req: Request, res: Response) => {
  try {
    const filter = req.query.filter;
    const current_user = getCurrentUser(req);
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countOI(filter ? JSON.parse(String(filter)): {}, current_user);

    const state = req.query.state;
    const f = filter ? JSON.parse(String(filter)): {}
    if(state) {
      f.state = state
    }
    const operation_instruction = await listOI(
      current_page,
      number_of_rows,
      f,
      current_user
    );
    res.json(operation_instruction);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const indexByOutputPlan = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countOI({});

    const state = req.query.state;
    const output_plan_id = req.params.outputPlanId;
    const filter = req.query.filter;
    const f = filter ? JSON.parse(String(filter)): {}
    f.output_plan_id = parseInt(output_plan_id)
    if(state) {
      f.state = state
    }
    const operation_instruction = await listOIByOutputPlanId(
      current_page,
      number_of_rows,
      f
    );
    res.json(operation_instruction);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const operation_instruction = await showOI(Number(req.params.id));
    if (!operation_instruction) {
      res.status(404).json(operation_instruction);
    } else {
      res.json(operation_instruction);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const output_id = req.query.output_plan_id;
    const current_user = getCurrentUser(req);
    const filter = req.query.filter;
    const state = req.query.state;
    const f = filter ? JSON.parse(String(filter)): {}
    const op_id = req.query.output_plan_id
    if(op_id) {
      f.output_plan_id = Number(op_id)
    }
    if(state) {
      f.state = state
    }
    const count = await countAllOI(
      Number(output_id),
      current_user,
      f
    );
    res.json(count);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const body = req.body;
  if (body.operation_instruction_type.length < 1) {
    return res
      .status(422)
      .send('At least one type of instruction operation is required');
  }

  const new_operation_instruction = await createOI({
    ...body,
    state: 'pending',
  });
  if (new_operation_instruction instanceof OperationInstruction) {
    res.status(201).json(new_operation_instruction);
  } else {
    res.status(422).json(new_operation_instruction);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateOI(Number(req.params.id), req.body);
    if (result.affected === 0) {
      res.status(404).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeOI(Number(req.params.id));
    if (result.affected === 0) {
      res.status(404).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  const state = req.body.state;
  const operation_instruction_id = req.params.operationInstructionId;

  const result = await changeStatusOI(parseInt(operation_instruction_id), {
    state,
  });

  if (Array.isArray(result)) {
    return res.sendStatus(422);
  } else {
    return res.sendStatus(204);
  }
};

export const states = (req: Request, res: Response) => {
  res.send({ states: getOperationInstructionStates() });
};
