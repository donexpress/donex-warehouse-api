import { FindOptionsWhere, ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { StoragePlan } from '../models/storage_plan.model';
import { PackingList } from '../models/packing_list.model';
import { User } from '../models/user.model';
import { showUser } from './user';
import { AOSWarehouse } from '../models/aos_warehouse.model';
import { showAOSWarehouse } from './aos_warehouse';
import { getPackingListByStoragePlanId } from './packing_list';
import states from '../config/states';
import { getStates } from '../helpers/states';

export const listStoragePlan = async (
  current_page: number,
  number_of_rows: number,
  query: string,
  state: string
) => {
  let where: FindOptionsWhere<StoragePlan> | FindOptionsWhere<StoragePlan>[] = [
    { customer_order_number: ILike(`%${query}%`) },
    { order_number: ILike(`%${query}%`) },
  ];

  if (state.trim().length !== 0) {
    where = { state: ILike(`%${state}%`) };
  }
  const storage_plans = await AppDataSource.manager.find(StoragePlan, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where,
    order: {
      id: 'DESC',
    },
  });
  const warehouses = await AppDataSource.manager.find(AOSWarehouse);
  const users = await AppDataSource.manager.find(User);
  const data = [];
  for (let i = 0; i < storage_plans.length; i++) {
    const storage_plan = storage_plans[i];

    let warehouse = null;
    if (storage_plan.warehouse_id) {
      warehouse = warehouses.find((w) => w.id === storage_plan.warehouse_id);
    }
    let user = null;
    if (storage_plan.user_id) {
      user = users.find((u) => u.id === storage_plan.user_id);
      if (user) {
        delete user.password;
      }
    }
    let packing_list = await getPackingListByStoragePlanId(storage_plan.id);
    if (!packing_list) {
      packing_list = [];
    }
    let storage_state = null;
    if (storage_plan.state) {
      const array_states = getStates(states.entry_plan);
      storage_state = array_states.find((s) => s.value === storage_plan.state)
    }
    data.push({
      ...storage_plan,
      warehouse,
      user,
      packing_list,
      storage_state
    });
  }
  return data;
};

export const findStoragePlanByOrderNumber = async (order_number: string) => {
  const storage_plan = await AppDataSource.manager.findOne(StoragePlan, {
    where: { order_number },
  });
  let packing_list = null;
  if (storage_plan) {
    packing_list = await AppDataSource.manager.find(PackingList, {
      where: { storage_plan_id: storage_plan.id },
    });
  }
  let warehouse = null;
  if (storage_plan.warehouse_id) {
    warehouse = await showAOSWarehouse(storage_plan.warehouse_id);
  }
  let user = null;
  if (storage_plan.user_id) {
    user = await showUser(storage_plan.user_id);
  }
  return { ...storage_plan, packing_list, warehouse, user };
};

export const countStoragePlan = async () => {
  return AppDataSource.manager.count(StoragePlan);
};

export const showStoragePlan = async (id: number) => {
  const storage_plan = await AppDataSource.manager.findOne(StoragePlan, {
    where: { id },
  });
  let packing_list = null;
  if (storage_plan) {
    packing_list = await getPackingListByStoragePlanId(storage_plan.id);
  }
  let warehouse = null;
  if (storage_plan.warehouse_id) {
    warehouse = await showAOSWarehouse(storage_plan.warehouse_id);
  }
  let user = null;
  if (storage_plan.user_id) {
    user = await showUser(storage_plan.user_id);
  }
  return { ...storage_plan, packing_list, warehouse, user };
};

export const createStoragePlan = async (data, user_id: number) => {
  const repository = await AppDataSource.getRepository(StoragePlan);
  if (data.delivered_time === '') {
    data.delivered_time = null;
  }
  if (data.customer_order_number) {
    const customer_order_number_count = await repository.count({
      where: { customer_order_number: data.customer_order_number },
    });
    if (customer_order_number_count > 0) {
      return { message: 'customer order number already exists' };
    }
  }
  const date = new Date();
  const month = date.getMonth() > 9 ? date.getMonth() : `0${date.getMonth()}`;
  const count = await countStoragePlan();
  let number = '';
  for (let i = 0; i < 6 - (count + 1).toString().length; i++) {
    number += '0';
  }
  data.order_number = `DEWMXI${date.getFullYear()}${month}${date.getDate()}${number}${
    count + 1
  }`;
  if (!data.user_id) {
    data.user_id = user_id;
  }
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updateStoragePlan = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(StoragePlan);
  const old_data = await repository.findOne({ where: { id } });
  if (!old_data) {
    return null;
  }
  delete old_data.history;
  const result = await repository.update(
    { id },
    { ...data, updated_at: new Date().toISOString() }
  );
  const history_data = await repository.findOne({ where: { id } });
  if (!history_data.history) {
    history_data.history = [];
  }
  history_data.history.push({
    type: 'storage_plan',
    data: { ...old_data, updated_at: new Date().toISOString() },
  });
  await repository.update({ id }, history_data);

  return result;
};

export const removeStoragePlan = async (id: number) => {
  const repository = await AppDataSource.getRepository(StoragePlan);
  const result = await repository.delete({ id });
  return result;
};
