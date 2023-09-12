import { ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { OutputPlan } from '../models/output_plan.model';
import { User } from '../models/user.model';
import { Warehouse } from '../models/warehouse.model';
import states from '../config/states';
import { findStoragePlanByOrderNumber } from './storage_plan';
import { getPackingListByCaseNumber } from './packing_list';
import { OperationInstruction } from '../models/instruction_operation.model';

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
  const warehouses = await AppDataSource.manager.find(Warehouse);
  const oper_inst = await AppDataSource.manager.find(OperationInstruction);
  return result.map((el) => {
    let user = null;
    if (el.user_id) {
      user = users.find((t) => t.id === el.user_id);
      delete user.password
    }
    let warehouse = null;
    if (el.warehouse_id) {
      warehouse = warehouses.find((t) => (t.id = el.warehouse_id));
    }
    if (el.state) {
      return { ...el, user, warehouse, state: states.output_plan[el.state] };
    }
    let operation_instructions = oper_inst.map((oi) => (oi.output_plan_id === el.id));
    
    return { ...el, user, warehouse, operation_instructions };
  });
};

export const getOutputPlanByState = async(current_page: number, number_of_rows: number, state: string) => {
  const result = await AppDataSource.manager.find(OutputPlan, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [{ state: ILike(`%${state}%`) }],
    order: {
      id: 'DESC',
    },
  });
  const users = await AppDataSource.manager.find(User);
  const warehouses = await AppDataSource.manager.find(Warehouse);
  return result.map((el) => {
    let user = null;
    if (el.user_id) {
      user = users.find((t) => t.id === el.user_id);
      delete user.password
    }
    let warehouse = null;
    if (el.warehouse_id) {
      warehouse = warehouses.find((t) => (t.id = el.warehouse_id));
    }
    if (el.state) {
      return { ...el, user, warehouse, state: states.output_plan[el.state] };
    }
    return { ...el, user, warehouse };
  });
}

export const listOutputPlanByState = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  const result = await AppDataSource.manager.find(OutputPlan, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [{ output_number: ILike(`%${query}%`) }],
    order: {
      id: 'ASC',
    },
  });
  const users = await AppDataSource.manager.find(User);
  const warehouses = await AppDataSource.manager.find(Warehouse);
  return result.map((el) => {
    let user = null;
    if (el.user_id) {
      user = users.find((t) => t.id === el.user_id);
    }
    let warehouse = null;
    if (el.warehouse_id) {
      warehouse = warehouses.find((t) => (t.id = el.warehouse_id));
    }
    return { ...el, user, warehouse };
  });
};

export const countOutputPlan = async () => {
  return AppDataSource.manager.count(OutputPlan);
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
    delete user.password
  }
  let warehouse = null;
  if (result.warehouse_id) {
    warehouse = await AppDataSource.manager.findOne(Warehouse, {
      where: { id: result.warehouse_id },
    });
  }
  const packing_lists = []
  for (let i = 0; i < result.case_numbers.length; i++) {
    const element = result.case_numbers[i];
    packing_lists.push(await getPackingListByCaseNumber(element))    
  }
  return { ...result, user, warehouse, packing_lists };
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
  data.updated_at = new Date().toISOString();
  const result = await repository.update({ id }, data);
  return result;
};

export const removeOutputPlan = async (id: number) => {
  const repository = await AppDataSource.getRepository(OutputPlan);
  const result = await repository.delete({ id });
  return result;
};


export const getOutputPlanStates = () => {
  const output_plan_states = []
  for (const [key, value] of Object.entries(states.output_plan)) {
    output_plan_states.push(value)
  }
  return output_plan_states
}