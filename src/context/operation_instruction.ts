import { FindOptionsWhere, ILike, UpdateResult } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { OperationInstruction } from '../models/instruction_operation.model';
import { ValidationError } from 'class-validator';
import states from '../config/states';
import warehouse_type from '../config/types';
import {
  countAOSWarehouse,
  listAOSWarehouse,
  showAOSWarehouse,
} from './aos_warehouse';
import { countUser, listUser, showUser } from './user';
import { countOutputPlan, listOutputPlan, showOutputPlan } from './output_plan';
import { getCountByState } from '../helpers/states';

export const listOI = async (
  current_page: number,
  number_of_rows: number,
  state: string | '',
  current_user: any
) => {
  let query = {};
  if (state === 'all') {
    const where:
      | FindOptionsWhere<OperationInstruction>
      | FindOptionsWhere<OperationInstruction>[] = {};
    if (current_user.customer_number) {
      where.user_id = current_user.id;
    }
    query = {
      take: number_of_rows,
      skip: (current_page - 1) * number_of_rows,
      where,
      order: {
        created_at: 'DESC',
      },
    };
  } else {
    const where:
      | FindOptionsWhere<OperationInstruction>
      | FindOptionsWhere<OperationInstruction>[] = { state };
    if (current_user.customer_number) {
      where.user_id = current_user.id;
    }
    query = {
      take: number_of_rows,
      skip: (current_page - 1) * number_of_rows,
      where,
      order: {
        created_at: 'DESC',
      },
    };
  }
  const operation_instructions = await AppDataSource.manager.find(
    OperationInstruction,
    query
  );

  const count_aos = await countAOSWarehouse();
  const warehouses = await listAOSWarehouse(1, count_aos, '');
  const count_user = await countUser();
  const users = await listUser(1, count_user, '');
  const count_op = await countOutputPlan();
  const output_plans = await listOutputPlan(1, count_op, state, '', current_user); // TODO check this
  const mod_operation_instructions = [];
  for (let i = 0; i < operation_instructions.length; i++) {
    const element = operation_instructions[i];
    const warehouse = warehouses.find((w) => w.id === element.warehouse_id);
    const user = users.find((u) => u.id === element.user_id);
    const output_plan = output_plans.find(
      (op) => op.id === element.output_plan_id
    );
    mod_operation_instructions.push({
      ...element,
      user,
      warehouse,
      output_plan,
    });
  }
  return mod_operation_instructions;
};

export const listOIByOutputPlanId = async (
  current_page: number,
  number_of_rows: number,
  state: string | '',
  output_plan_id: number
): Promise<OperationInstruction[] | null> => {
  const where_query =
    state == '' ? { output_plan_id } : { state, output_plan_id };
  const operation_instructions = await AppDataSource.manager.find(
    OperationInstruction,
    {
      take: number_of_rows,
      skip: (current_page - 1) * number_of_rows,
      where: where_query,
      order: {
        created_at: 'DESC',
      },
    }
  );
  const mod_operation_instructions = [];
  for (let i = 0; i < operation_instructions.length; i++) {
    const element = operation_instructions[i];
    const warehouse = await showAOSWarehouse(element.warehouse_id);
    const user = await showUser(element.user_id);
    const output_plan = await showOutputPlan(element.output_plan_id);
    mod_operation_instructions.push({
      ...element,
      user,
      warehouse,
      output_plan,
    });
  }
  return mod_operation_instructions;
};

export const countOI = async (current_user?: any) => {
  let where: any = {};
  if (current_user && current_user.customer_number) {
    where.user_id = current_user.id;
  }
  return AppDataSource.manager.count(OperationInstruction, { where });
};

export const countAllOI = async (
  output_id: number,
  current_user: any,
  query = ''
): Promise<Object> => {
  const repository = AppDataSource.getRepository(OperationInstruction);
  const total = await countOI();

  const pending = await getCountByStateAndOutputId(
    repository,
    states.operation_instruction.pending.value,
    output_id,
    current_user
  );
  const processed = await getCountByStateAndOutputId(
    repository,
    states.operation_instruction.processed.value,
    output_id,
    current_user
  );
  const processing = await getCountByStateAndOutputId(
    repository,
    states.operation_instruction.processing.value,
    output_id,
    current_user
  );

  const cancelled = await getCountByStateAndOutputId(
    repository,
    states.operation_instruction.cancelled.value,
    output_id,
    current_user
  );

  const result = {
    total,
    pending,
    processed,
    processing,
    cancelled,
  };
  return result;
};

export const getWhere = async (
  current_user,
  query,
  output_plan_id,
  state_value
) => {
  let where:
    | FindOptionsWhere<OperationInstruction>
    | FindOptionsWhere<OperationInstruction>[] = {
    state: state_value,
  };
  if (current_user.customer_number && output_plan_id) {
    where = [
      {
        number_delivery: ILike(`%${query}%`),
        state: state_value,
        user_id: current_user.id,
        output_plan_id: output_plan_id,
      },
    ];
  } else {
    where = [
      {
        number_delivery: ILike(`%${query}%`),
        state: state_value,
      },
    ];
  }

  return where;
};

export const showOI = async (
  id: number
): Promise<OperationInstruction | null> => {
  return await AppDataSource.manager.findOne(OperationInstruction, {
    where: { id },
  });
};

export const showOIByWarehouseId = async (
  warehouse_id: number
): Promise<OperationInstruction | null> => {
  return await AppDataSource.manager.findOne(OperationInstruction, {
    where: { warehouse_id },
  });
};

export const createOI = async (
  params
): Promise<OperationInstruction | ValidationError[]> => {
  const repository = await AppDataSource.getRepository(OperationInstruction);
  const result = repository.create({
    ...params,
    operation_instruction_type: getParamsInstructionOperation(params),
  });
  return await validateContext(AppDataSource, result);
};

export const updateOI = async (id: number, params): Promise<UpdateResult> => {
  const repository = await AppDataSource.getRepository(OperationInstruction);
  return await repository.update(
    { id },
    {
      ...params,
      operation_instruction_type: getParamsInstructionOperation(params),
    }
  );
};

export const removeOI = async (id: number) => {
  const repository = await AppDataSource.getRepository(OperationInstruction);
  return await repository.delete({ id });
};

export const changeStatusOI = async (
  id: number,
  state
): Promise<UpdateResult> => {
  const repository = await AppDataSource.getRepository(OperationInstruction);
  return await repository.update({ id }, state);
};

export const getOperationInstructionStates = () => {
  const operation_instruction_states = [];
  for (const [key, value] of Object.entries(states.operation_instruction)) {
    operation_instruction_states.push(value);
  }
  return operation_instruction_states;
};

export const getOperationInstructionTypes = () => {
  const operation_instruction_types = [];
  for (const [key, value] of Object.entries(
    warehouse_type.operation_instruction_type
  )) {
    operation_instruction_types.push(value);
  }
  return operation_instruction_types;
};

const getParamsInstructionOperation = (params) => {
  const operation_instruction_types = params.operation_instruction_type;
  let instruction_type = [];
  const config_operation_types = getOperationInstructionTypes();
  operation_instruction_types.map((operation_type) => {
    config_operation_types.map((config_type) => {
      if (operation_type === config_type.value) {
        instruction_type.push(config_type);
      }
    });
  });
  //const operation_instruction_type = { instruction_type };
  return { instruction_type };
};

const getCountByStateAndOutputId = async (
  repository,
  state_value,
  output_plan_id,
  current_user
): Promise<number> => {
  let where:
    | FindOptionsWhere<OperationInstruction>
    | FindOptionsWhere<OperationInstruction>[] = {};
  if (output_plan_id) {
    where = { state: state_value, output_plan_id: output_plan_id };
  } else {
    where = { state: state_value };
  }
  if (current_user.customer_number) {
    where.user_id = current_user.id;
  }
  return await repository.count({
    where,
  });
};
