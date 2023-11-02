import {
  ArrayContains,
  Between,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  In,
  MoreThan,
  Not,
} from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { OutputPlan } from '../models/output_plan.model';
import { User } from '../models/user.model';
import states from '../config/states';
import {
  chgeckPackingListCaseNumberByUser,
  dispatchBulkBoxes,
  getPackingListByCaseNumber,
  getPackingListByCaseNumbers,
  getPackingListFromCaseNumbers,
  isStored,
  returnDispatchedBulkBoxes,
} from './packing_list';
import { OperationInstruction } from '../models/instruction_operation.model';
import { getAppendagesByOutputPlan } from './appendix';
import { getCountByState } from '../helpers/states';
import { AOSWarehouse } from '../models/aos_warehouse.model';
import { addresses, destinations } from '../config/destination';
import { OutputPlanFilter } from '../types/OutputPlanFilter';
import { filterStoragePlan } from './storage_plan';
import { PackingList } from '../models/packing_list.model';
import { calcDate, removeNullProperties } from '../helpers';

export const listOutputPlan = async (
  current_page: number,
  number_of_rows: number,
  state: string,
  query: string,
  current_user: any,
  filter: OutputPlanFilter
) => {
  const fl =
    filter.location.length !== Object.keys(destinations).length
      ? { destination: In(filter.location) }
      : {};
  if (filter.initialDate) {
    const start_date = new Date(filter.initialDate);
    let final_date = new Date(filter.initialDate);
    if (filter.finalDate) {
      final_date = new Date(filter.finalDate);
    }
    final_date.setDate(final_date.getDate() + 1);
    fl['delivered_time'] = Between(
      start_date.toISOString(),
      final_date.toISOString()
    );
  }
  let where: FindOptionsWhere<OutputPlan> | FindOptionsWhere<OutputPlan>[] = [
    { output_number: ILike(`%${query}%`), state: state, ...fl },
    { case_numbers: ArrayContains([query]), state: state, ...fl },
    { reference_number: ILike(`%${query}%`), state: state, ...fl },
  ];

  if (current_user.customer_number) {
    where = [
      {
        output_number: ILike(`%${query}%`),
        state: state,
        user_id: current_user.id,
        ...fl,
      },
      {
        case_numbers: ArrayContains([query]),
        state: state,
        user_id: current_user.id,
        ...fl,
      },
      {
        reference_number: ILike(`%${query}%`),
        state: state,
        user_id: current_user.id,
        ...fl,
      },
    ];
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
      if (
        res &&
        res.package_shelf &&
        res.package_shelf[0] &&
        res.package_shelf[0].created_at
      ) {
        const date = res.dispatched_time
          ? res.dispatched_time
          : new Date().toISOString();
        const storage_date = res.package_shelf[0].created_at;
        const storage_time = calcDate(date, storage_date);
        res['storage_time'] = storage_time.total_days;
      }
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
        state: states.output_plan[el.state].value,
        destination_ref: destination,
        packing_lists,
        operation_instructions,
      });
    } else {
      mod_package_list.push({
        ...el,
        user,
        warehouse,
        operation_instructions,
        destination_ref: destination,
        packing_lists,
      });
    }
  }
  return mod_package_list;
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
      if (res && res.package_shelf && res.package_shelf.created_at) {
        const date = res.dispatched_time
          ? res.dispatched_time
          : new Date().toISOString();
        const storage_date = res.package_shelf.created_at;
        const storage_time = calcDate(date, storage_date);
        res['storage_time'] = storage_time.total_days;
      }
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
  current_user: any,
  query,
  filter: OutputPlanFilter
): Promise<Object> => {
  const repository = AppDataSource.getRepository(OutputPlan);
  const total = await countOutputPlan(current_user);
  const pending = await getCountByState(
    repository,
    await getWhere(
      current_user,
      query,
      states.output_plan.pending.value,
      filter
    )
  );
  const to_be_processed = await getCountByState(
    repository,
    await getWhere(
      current_user,
      query,
      states.output_plan.to_be_processed.value,
      filter
    )
  );
  const processing = await getCountByState(
    repository,
    await getWhere(
      current_user,
      query,
      states.output_plan.processing.value,
      filter
    )
  );
  const dispatched = await getCountByState(
    repository,
    await getWhere(
      current_user,
      query,
      states.output_plan.dispatched.value,
      filter
    )
  );
  const cancelled = await getCountByState(
    repository,
    await getWhere(
      current_user,
      query,
      states.output_plan.cancelled.value,
      filter
    )
  );

  const result = {
    total,
    pending,
    to_be_processed,
    processing,
    dispatched,
    cancelled,
  };
  return result;
};

export const getWhere = async (
  current_user,
  query,
  state_value,
  filter: OutputPlanFilter
) => {
  const fl =
    filter.location.length !== Object.keys(destinations).length
      ? { destination: In(filter.location) }
      : {};
  if (filter.initialDate) {
    const start_date = new Date(filter.initialDate);
    let final_date = new Date(filter.initialDate);
    if (filter.finalDate) {
      final_date = new Date(filter.finalDate);
    }
    final_date.setDate(final_date.getDate() + 1);
    fl['delivered_time'] = Between(
      start_date.toISOString(),
      final_date.toISOString()
    );
  }

  let where: FindOptionsWhere<OutputPlan> | FindOptionsWhere<OutputPlan>[] = {
    state: state_value,
    ...fl,
  };
  if (current_user.customer_number) {
    where = [
      {
        output_number: ILike(`%${query}%`),
        state: state_value,
        user_id: current_user.id,
        ...fl,
      },
      {
        case_numbers: ArrayContains([query]),
        state: state_value,
        user_id: current_user.id,
        ...fl,
      },
      {
        reference_number: ILike(`%${query}%`),
        state: state_value,
        user_id: current_user.id,
        ...fl,
      },
    ];
  } else {
    where = [
      { output_number: ILike(`%${query}%`), state: state_value, ...fl },
      { case_numbers: ArrayContains([query]), state: state_value, ...fl },
      { reference_number: ILike(`%${query}%`), state: state_value, ...fl },
    ];
  }

  return where;
};

export const showOutputPlan = async (id: number) => {
  const result = await AppDataSource.manager.findOne(OutputPlan, {
    where: { id },
  });
  if (result) {
    let destination = null;
    if (result.destination && destinations[result.destination]) {
      destination = destinations[result.destination];
    }
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
    const packing_lists = await getPackingListByCaseNumbers(
      result.case_numbers
    );
    packing_lists.forEach((pl) => {
      if (pl && pl.package_shelf && pl.package_shelf.created_at) {
        const date = pl.dispatched_time
          ? pl.dispatched_time
          : new Date().toISOString();
        const storage_date = pl.package_shelf.created_at;
        const storage_time = calcDate(date, storage_date);
        pl['storage_time'] = storage_time.total_days;
      }
    });
    const appendages = await getAppendagesByOutputPlan(id);
    return {
      ...result,
      user,
      warehouse,
      packing_lists,
      appendages,
      destination_ref: destination,
    };
  } else {
    return null;
  }
};

export const createOutputPlan = async (data: any) => {
  const repository = await AppDataSource.getRepository(OutputPlan);
  const date = new Date();
  const month =
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  data.output_number = '';
  data.state = states.output_plan.pending.value;
  data.amount = 0;
  data.box_amount = 0;
  data.delivered_quantity = 0;
  data.output_boxes = 0;
  data.palets_amount = 0;
  const result = await repository.create(data);
  const validated = await validateContext(AppDataSource, result);
  if (validated instanceof OutputPlan) {
    const on = `DEWMXO${date.getFullYear()}${month}${
      date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()
    }${validated.id.toString().padStart(6, '0')}`;
    await repository.update({ id: validated.id }, { output_number: on });
    validated.output_number = on;
  }
  return validated;
};

export const updateOutputPlan = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(OutputPlan);
  const exitPlan = await repository.findOne({ where: { id } });
  const stored = [];
  if (data.case_numbers) {
    let contiue = true;
    for (let i = 0; i < data.case_numbers.length; i++) {
      const isOwnByMe = await chgeckPackingListCaseNumberByUser(
        data.case_numbers[i],
        exitPlan.user_id
      );
      if (!isOwnByMe) {
        contiue = false;
      }
      const is_stored = await isStored(data.case_numbers[i]);
      if (is_stored) {
        stored.push(data.case_numbers[i]);
      }
    }
    if (contiue) {
      data.case_numbers = stored;
      const box_amount = data.case_numbers.length;
      if (box_amount > 0) {
        data.output_boxes = box_amount;
        data.box_amount = box_amount;
      }
    } else {
      return { warning: 'own' };
    }
  }
  data.updated_at = new Date().toISOString();
  const result = await repository.update({ id }, data);
  const output_plan = await repository.findOne({ where: { id } });
  if (
    data.state &&
    data.state !== exitPlan.state &&
    exitPlan.state === 'dispatched'
  ) {
    await returnDispatchedBulkBoxes(output_plan.case_numbers);
  } else if (data.state === 'dispatched') {
    await dispatchBulkBoxes(output_plan.case_numbers);
  } else if (data.state === 'processing') {
    await returnDispatchedBulkBoxes(output_plan.case_numbers);
  }
  if (
    data.case_numbers !== undefined &&
    exitPlan.case_numbers.length !== stored.length &&
    data.case_numbers.length > 0
  ) {
    return { warning: 'stored' };
  }
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

export const getOutputPlanByFilter = async (
  current_page: number,
  number_of_rows: number,
  filter: OutputPlanFilter
) => {
  let where: FindOptionsWhere<OutputPlan> | FindOptionsWhere<OutputPlan>[] = {};
  if (filter.initialDate) {
    const date = new Date(filter.initialDate);
    let final_date = new Date(filter.initialDate);
    if (filter.finalDate) {
      final_date = new Date(filter.finalDate);
    }
    final_date.setDate(final_date.getDate() + 1);
    where.delivered_time = Between(
      date.toISOString(),
      final_date.toISOString()
    );
  }
  if (filter.location) {
    where = { ...where, destination: In(filter.location) };
  }
  const result = await AppDataSource.manager.find(OutputPlan, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
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

export const changeOutputPlanState = async (id: number, state) => {
  const repository = await AppDataSource.getRepository(OutputPlan);
  const result = await repository.update({ id }, { state });
  return result;
};

export const returnBoxes = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(OutputPlan);
  const output_plan = await showOutputPlan(id);
  data.updated_at = new Date().toISOString();
  if (output_plan.state === 'dispatched') {
    await returnDispatchedBulkBoxes(data.case_numbers);
  }
  data.case_numbers = output_plan.case_numbers.filter(
    (el) => !data.case_numbers.find((cn) => cn === el)
  );
  const result = await repository.update({ id }, data);
  return result;
};

export const nonBoxesOnExitPlans = async (
  excluded_output_plan: number,
  case_numbers: string[]
) => {
  const none_store: string[] = [];
  let stored: string[] = [];
  const output_plans = await AppDataSource.manager.find(OutputPlan, {
    where: { id: Not(excluded_output_plan) },
  });
  output_plans.forEach((op) => {
    stored = stored.concat(op.case_numbers);
  });
  case_numbers.forEach((cn) => {
    if (stored.find((s) => s === cn) === undefined) {
      none_store.push(cn);
    }
  });
  return none_store;
};

export const getNonExcludedOutputPlans = async (
  excluded_output_plan: number
) => {
  const output_plans = await AppDataSource.manager.find(OutputPlan, {
    where: {
      id: Not(excluded_output_plan),
      state: Not('cancelled'),
      box_amount: MoreThan(0),
    },
  });
  return output_plans;
};

export const pullBoxes = async ({
  id,
  data,
}: {
  id: number;
  data: {
    case_number: string;
    warehouse_order_number: string;
  };
}) => {
  let case_numbers: string[] = [];
  let packing_lists: PackingList[] = [];
  const error_type = {};
  if (data.case_number && data.case_number.trim() !== '') {
    const split = data.case_number.split(',').map((el) => el.trim());
    case_numbers = case_numbers.concat(split);
  }
  if (
    data.warehouse_order_number &&
    data.warehouse_order_number.trim() !== ''
  ) {
    const arr = data.warehouse_order_number.split(',');
    for (let i = 0; i < arr.length; i++) {
      const to_search = arr[i];
      const storage_plans = await filterStoragePlan(to_search.trim());
      if (storage_plans) {
        storage_plans.forEach((storage_plan) => {
          storage_plan.packing_list.forEach((pl: PackingList) => {
            if (
              case_numbers.find((cn) => cn === pl.case_number) === undefined
            ) {
              packing_lists.push(pl);
            }
          });
        });
      }
    }
  }
  packing_lists = packing_lists.concat(
    await getPackingListFromCaseNumbers(case_numbers)
  );
  const total = packing_lists.length;
  // @ts-ignore
  packing_lists = packing_lists.filter((pl) => pl.package_shelf.length > 0);
  if (total !== packing_lists.length) {
    error_type['stored'] = true;
  }
  const storage_plan_id: number[] = [];
  packing_lists.forEach((pl) => {
    if (storage_plan_id.find((el) => el === pl.storage_plan_id) === undefined) {
      storage_plan_id.push(pl.storage_plan_id);
    }
  });
  const output_plans: OutputPlan[] = await getNonExcludedOutputPlans(id);
  const unstored: PackingList[] = [];
  packing_lists.forEach((pl) => {
    let found: boolean = false;
    output_plans.forEach((op) => {
      if (op.case_numbers.find((op_cn) => op_cn === pl.case_number)) {
        found = true;
      }
    });
    if (!found) {
      unstored.push(pl);
    }
  });
  packing_lists = unstored;
  if (total !== packing_lists.length) {
    error_type['already_used'] = true;
  }
  const respository = await AppDataSource.getRepository(OutputPlan);
  const current = await respository.findOne({ where: { id } });
  packing_lists.forEach((pl) => {
    if (
      current.case_numbers.find((c_cn) => c_cn === pl.case_number) === undefined
    ) {
      current.case_numbers.push(pl.case_number);
    } else {
      error_type['duplicated'] = true;
    }
  });
  const box_amount = current.case_numbers.length;
  if (box_amount > 0) {
    current.output_boxes = box_amount;
    current.box_amount = box_amount;
  }
  const result = await respository.update({ id }, current);
  if (Object.keys(error_type).length > 0) {
    return error_type;
  }
  return result;
};

export const cleanOutputPlan = async () => {
  const result = await AppDataSource.manager.find(OutputPlan, {
    where: { state: Not(states.output_plan.cancelled.value) },
    order: {
      id: 'DESC',
    },
  });
  const mod_package_list = [];
  for (let i = 0; i < result.length; i++) {
    const el = result[i];
    const packing_lists = await getPackingListByCaseNumbers(el.case_numbers);
    packing_lists.forEach((pl) => {
      if (pl && pl.package_shelf && pl.package_shelf.created_at) {
        const date = pl.dispatched_time
          ? pl.dispatched_time
          : new Date().toISOString();
        const storage_date = pl.package_shelf.created_at;
        const storage_time = calcDate(date, storage_date);
        pl['storage_time'] = storage_time.total_days;
      }
    });
    mod_package_list.push({
      ...el,
      packing_lists,
    });
  }
  return mod_package_list;
};

export const listOutputPlanRequired = async (
  state: string,
  current_user: any
) => {
  let where: FindOptionsWhere<OutputPlan> | FindOptionsWhere<OutputPlan>[] = {
    state,
  };

  if (current_user.customer_number) {
    where = {
      state: state,
      user_id: current_user.id,
    };
  }
  const result = await AppDataSource.manager.find(OutputPlan, {
    where,
    order: {
      id: 'DESC',
    },
  });

  const mod_package_list = [];
  for (let i = 0; i < result.length; i++) {
    const el = result[i];
    let user = null;
    let destination = destinations[el.destination];

    const packing_lists = [];
    for (let i = 0; i < el.case_numbers.length; i++) {
      const element = el.case_numbers[i];
      const res = await getPackingListByCaseNumber(element);
      if (res) {
        packing_lists.push(res);
      }
    }

    if (el.state) {
      mod_package_list.push({
        ...el,
        user,
        state: states.output_plan[el.state],
        destination_ref: destination,
        packing_lists,
      });
    } else {
      mod_package_list.push({
        ...el,
        user,
        destination_ref: destination,
        packing_lists,
      });
    }
  }
  return mod_package_list;
};
