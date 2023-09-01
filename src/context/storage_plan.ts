import { ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { StoragePlan } from '../models/storage_plan.model';
import { PackingList } from '../models/packing_list.model';
import { Warehouse } from '../models/warehouse.model';
import { User } from '../models/user.model';
import { showUser } from './user';
import { showWarehouse } from './warehouse';

export const listStoragePlan = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  const storage_plans = await AppDataSource.manager.find(StoragePlan, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [
      { customer_order_number: ILike(`%${query}%`) },
      { order_number: ILike(`%${query}%`) },
    ],
    order: {
      id: 'ASC',
    },
  });
  const warehouses = await AppDataSource.manager.find(Warehouse);
  const users = await AppDataSource.manager.find(User);

  return storage_plans.map((storage_plan) => {
    let warehouse = null;
    if (storage_plan.warehouse_id) {
      warehouse = warehouses.find((w) => w.id === storage_plan.warehouse_id);
    }
    let user = null;
    if (storage_plan.user_id) {
      user = users.find((u) => u.id === storage_plan.user_id);
    }
    return { ...storage_plan, warehouse, user };
  });
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
    packing_list = await AppDataSource.manager.find(PackingList, {
      where: { storage_plan_id: id },
    });
  }
  let warehouse = null;
  if (storage_plan.warehouse_id) {
    warehouse = await showWarehouse(storage_plan.warehouse_id);
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
    { ...data, updated_at: new Date().toDateString() }
  );
  const history_data = await repository.findOne({ where: { id } });
  if (!history_data.history) {
    history_data.history = [];
  }
  history_data.history.push({ type: 'storage_plan', data: old_data });
  await repository.update({ id }, history_data);

  return result;
};

export const removeStoragePlan = async (id: number) => {
  const repository = await AppDataSource.getRepository(StoragePlan);
  const result = await repository.delete({ id });
  return result;
};
