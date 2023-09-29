import { Between, FindOneOptions, FindOptionsWhere, ILike } from 'typeorm';
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
import { addresses, destinations } from '../config/destination';
import { OutputPlanFilter } from '../types/OutputPlanFilter';

export const listOutputPlan = async (
  current_page: number,
  number_of_rows: number,
  query: string,
  current_user: any
) => {
  const where: FindOptionsWhere<OutputPlan> | FindOptionsWhere<OutputPlan>[] = {
    output_number: ILike(`%${query}%`),
  };
  if (current_user.customer_number) {
    where.user_id = current_user.id;
  }
  const result = await AppDataSource.manager.find(OutputPlan, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where,
    order: {
      id: 'DESC',
    },
  });
  const users = await AppDataSource.manager.find(User);
  const warehouses = await AppDataSource.manager.find(AOSWarehouse);
  const oper_inst = await AppDataSource.manager.find(OperationInstruction);
  const mod_package_list = [];
  for (let i = 0; i < result.length; i++) {
    const el = result[i];
    let user = null;
    if (el.user_id) {
      user = users.find((t) => t.id === el.user_id);
      delete user.password;
    }
    let warehouse = null;
    if (el.warehouse_id) {
      warehouse = warehouses.find((t) => t.id === el.warehouse_id);
    }
    let destination = destinations[el.destination];

    const packing_lists = [];
    for (let i = 0; i < el.case_numbers.length; i++) {
      const element = el.case_numbers[i];
      const res = await getPackingListByCaseNumber(element);
      if (res) {
        packing_lists.push(res);
      }
    }

    let operation_instructions = [];
    oper_inst.map((oi) => {
      if (oi.output_plan_id === el.id) {
        return operation_instructions.push(oi);
      } else {
        operation_instructions;
      }
    });
    if (el.state) {
      mod_package_list.push({
        ...el,
        user,
        warehouse,
        state: states.output_plan[el.state],
        destination_ref: destination,
        packing_lists
      });
    } else {
      mod_package_list.push({
        ...el,
        user,
        warehouse,
        operation_instructions,
        destination_ref: destination,
        packing_lists
      });
    }
  }
  return mod_package_list
};

export const getOutputPlanByState = async (
  current_page: number,
  number_of_rows: number,
  state: string,
  current_user: any
) => {
  const where: FindOptionsWhere<OutputPlan> | FindOptionsWhere<OutputPlan>[] = {
    state: ILike(`%${state}%`),
  };
  if (current_user.customer_number) {
    where.user_id = current_user.id;
  }
  const result = await AppDataSource.manager.find(OutputPlan, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where,
    order: {
      id: 'DESC',
    },
  });
  const users = await AppDataSource.manager.find(User);
  const warehouses = await AppDataSource.manager.find(AOSWarehouse);
  const operation_instruction = await AppDataSource.manager.find(
    OperationInstruction
  );

  const addrs = addresses;
  const mod_package_list = [];
  for (let i = 0; i < result.length; i++) {
    const el = result[i];
    let user = null;
    if (el.user_id) {
      user = users.find((t) => t.id === el.user_id);
      delete user.password;
    }
    let warehouse = null;
    let destination = destinations[el.destination];
    if (el.warehouse_id) {
      warehouse = warehouses.find((t) => t.id === el.warehouse_id);
    }
    const packing_lists = [];
    for (let i = 0; i < el.case_numbers.length; i++) {
      const element = el.case_numbers[i];
      const res = await getPackingListByCaseNumber(element);
      if (res) {
        packing_lists.push(res);
      }
    }
    const operation_instructions = operation_instruction.filter(
      (op) => op.output_plan_id === el.id
    );
    let address_ref = null;
    if (el.destination && el.destination != 'private_address') {
      address_ref = addrs[el.destination].find(
        (dest) => dest.value === el.address
      );
    }
    if (el.state) {
      mod_package_list.push({
        ...el,
        user,
        warehouse,
        state: states.output_plan[el.state],
        destination_ref: destination,
        operation_instructions,
        address_ref,
        packing_lists,
      });
    } else {
      mod_package_list.push({
        ...el,
        user,
        warehouse,
        destination_ref: destination,
        operation_instructions,
        address_ref,
        packing_lists,
      });
    }
  }
  return mod_package_list;
};

export const countOutputPlan = async (current_user?) => {
  const where: any = {};
  if (current_user && current_user.customer_number) {
    where.user_id = current_user.id;
  }
  return AppDataSource.manager.count(OutputPlan, { where });
};

export const countAllOutputPlan = async (
  current_user: any
): Promise<Object> => {
  const repository = AppDataSource.getRepository(OutputPlan);
  const total = await countOutputPlan(current_user);
  const pending = await getCountByState(
    repository,
    states.output_plan.pending.value,
    current_user
  );
  const to_be_processed = await getCountByState(
    repository,
    states.output_plan.to_be_processed.value,
    current_user
  );
  const processing = await getCountByState(
    repository,
    states.output_plan.processing.value,
    current_user
  );
  const dispatched = await getCountByState(
    repository,
    states.output_plan.dispatched.value,
    current_user
  );
  const cancelled = await getCountByState(
    repository,
    states.output_plan.cancelled.value,
    current_user
  );
  /* const collecting = await getCountByState(
    repository,
    states.output_plan.collecting.value
  ); */

  const result = {
    total,
    pending,
    to_be_processed,
    processing,
    dispatched,
    cancelled,
    //collecting,
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
    const res = await getPackingListByCaseNumber(element);
    if (res) {
      packing_lists.push(res);
    }
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
  if (data.case_numbers) {
    const box_amount = data.case_numbers.length;
    if (box_amount > 0) {
      data.output_boxes = box_amount;
      data.box_amount = box_amount;
    }
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

export const getDestinations = () => {
  const dest = [];
  for (const [key, value] of Object.entries(destinations)) {
    dest.push(value);
  }
  return dest;
};

export const getAddresses = () => {
  // const addrss = [];
  // for (const [key, value] of Object.entries(addresses)) {
  //   addrss.push(value);
  // }
  return addresses;
};

export const getOutputPlanByFilter = async (filter: OutputPlanFilter) => {
  const where: FindOptionsWhere<OutputPlan> | FindOptionsWhere<OutputPlan>[] =
    {};
  if (filter.date) {
    const date = new Date(filter.date);
    const new_date = new Date(filter.date);
    new_date.setDate(new_date.getDate() + 1);
    where.delivered_time = Between(date.toISOString(), new_date.toISOString());
  }
  if (filter.location) {
    for (const [key, value] of Object.entries(destinations)) {
      if (
        value.value.toLowerCase() === filter.location.toLowerCase() ||
        value.value.toLowerCase() === filter.location.toLowerCase() ||
        value.value.toLowerCase() === filter.location.toLowerCase()
      ) {
        where.destination = value.value;
      }
    }
  }
  const result = await AppDataSource.manager.find(OutputPlan, {
    where,
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
    let destination = destinations[el.destination];
    if (el.warehouse_id) {
      warehouse = warehouses.find((t) => t.id === el.warehouse_id);
    }
    if (el.state) {
      return {
        ...el,
        user,
        warehouse,
        state: states.output_plan[el.state],
        destination_ref: destination,
      };
    }
    return { ...el, user, warehouse, destination_ref: destination };
  });
};
