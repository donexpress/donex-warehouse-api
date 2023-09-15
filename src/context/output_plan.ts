import { ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { OutputPlan } from '../models/output_plan.model';
import { User } from '../models/user.model';
import states from '../config/states';
import { getPackingListByCaseNumber } from './packing_list';
import { OperationInstruction } from '../models/instruction_operation.model';
import { getAppendagesByOutputPlan } from './appendix';
import { getCountByState } from '../helpers/states';
import { AOSWarehouse } from '../models/aos_warehouse.model';
import { destinations } from '../constants/destination';

export const listOutputPlan = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  const result = await AppDataSource.manager.find(OutputPlan, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [{ output_number: ILike(`%${query}%`) }],
    order: {
      id: 'DESC',
    },
  });
  const users = await AppDataSource.manager.find(User);
  const warehouses = await AppDataSource.manager.find(AOSWarehouse);
  const oper_inst = await AppDataSource.manager.find(OperationInstruction);
  return result.map((el) => {
    let user = null;
    if (el.user_id) {
      user = users.find((t) => t.id === el.user_id);
      delete user.password;
    }
    let warehouse = null;
    if (el.warehouse_id) {
      warehouse = warehouses.find((t) => (t.id === el.warehouse_id));
    }
    if (el.state) {
      return { ...el, user, warehouse, state: states.output_plan[el.state] };
    }
    let operation_instructions = [];
    oper_inst.map((oi) => {
      if (oi.output_plan_id === el.id) {
        return operation_instructions.push(oi);
      } else {
        operation_instructions;
      }
    });

    return { ...el, user, warehouse, operation_instructions };
  });
};

export const getOutputPlanByState = async (
  current_page: number,
  number_of_rows: number,
  state: string
) => {
  const result = await AppDataSource.manager.find(OutputPlan, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [{ state: ILike(`%${state}%`) }],
    order: {
      id: 'DESC',
    },
  });
  const users = await AppDataSource.manager.find(User);
  const warehouses = await AppDataSource.manager.find(AOSWarehouse);
  return result.map((el) => {
    let user = null;
    if (el.user_id) {
      user = users.find((t) => t.id === el.user_id);
      delete user.password;
    }
    let warehouse = null;
    if (el.warehouse_id) {
      warehouse = warehouses.find((t) => (t.id === el.warehouse_id));
    }
    if (el.state) {
      return { ...el, user, warehouse, state: states.output_plan[el.state] };
    }
    return { ...el, user, warehouse };
  });
};

export const countOutputPlan = async () => {
  return AppDataSource.manager.count(OutputPlan);
};

export const countAllOutputPlan = async (): Promise<Object> => {
  const repository = AppDataSource.getRepository(OutputPlan);
  const all = await countOutputPlan();
  const pending = await getCountByState(
    repository,
    states.output_plan.pending.value
  );
  const to_be_processed = await getCountByState(
    repository,
    states.output_plan.to_be_processed.value
  );
  const processing = await getCountByState(
    repository,
    states.output_plan.processing.value
  );
  const dispatched = await getCountByState(
    repository,
    states.output_plan.dispatched.value
  );
  const cancelled = await getCountByState(
    repository,
    states.output_plan.cancelled.value
  );
  const collecting = await getCountByState(
    repository,
    states.output_plan.collecting.value
  );

  const result = {
    all,
    pending,
    to_be_processed,
    processing,
    dispatched,
    cancelled,
    collecting,
  };
  return result;
};

export const showOutputPlan = async (id: number) => {
  const result = await AppDataSource.manager.findOne(OutputPlan, {
    where: { id },
  });
  let user = null;
  if (result.user_id) {
    user = await AppDataSource.manager.findOne(User, {
      where: { id: result.user_id },
    });
    delete user.password;
  }
  let warehouse = null;
  if (result.warehouse_id) {
    warehouse = await AppDataSource.manager.findOne(AOSWarehouse, {
      where: { id: result.warehouse_id },
    });
  }
  const packing_lists = [];
  for (let i = 0; i < result.case_numbers.length; i++) {
    const element = result.case_numbers[i];
    packing_lists.push(await getPackingListByCaseNumber(element));
  }
  const appendages = await getAppendagesByOutputPlan(id);
  return { ...result, user, warehouse, packing_lists, appendages };
};

export const createOutputPlan = async (data: any) => {
  const repository = await AppDataSource.getRepository(OutputPlan);
  const date = new Date();
  const month = date.getMonth() > 9 ? date.getMonth() : `0${date.getMonth()}`;
  const count = await countOutputPlan();
  let number = '';
  for (let i = 0; i < 6 - (count + 1).toString().length; i++) {
    number += '0';
  }
  data.output_number = `DEWMXO${date.getFullYear()}${month}${date.getDate()}${number}${
    count + 1
  }`;
  data.state = states.output_plan.pending.value;
  data.amount = 0;
  data.box_amount = 0;
  data.delivered_quantity = 0;
  data.output_boxes = 0;
  data.palets_amount = 0;
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updateOutputPlan = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(OutputPlan);
  const box_amount = data.case_numbers.length
  if(box_amount > 0) {
    data.output_boxes = box_amount
    data.box_amount = box_amount
  }
  data.updated_at = new Date().toISOString();
  const result = await repository.update({ id }, data);
  return result;
};

export const removeOutputPlan = async (id: number) => {
  const repository = await AppDataSource.getRepository(OutputPlan);
  const result = await repository.delete({ id });
  return result;
};