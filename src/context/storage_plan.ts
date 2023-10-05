import { FindOptionsWhere, ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { StoragePlan } from '../models/storage_plan.model';
import { PackingList } from '../models/packing_list.model';
import { User } from '../models/user.model';
import { showUser } from './user';
import { AOSWarehouse } from '../models/aos_warehouse.model';
import { showAOSWarehouse } from './aos_warehouse';
import {
  createPackingList,
  getPackingListByStoragePlanId,
} from './packing_list';
import states from '../config/states';
import { getCountByState, getStates } from '../helpers/states';

export const listStoragePlan = async (
  current_page: number,
  number_of_rows: number,
  query: string,
  state: string,
  current_user
) => {
  let where: FindOptionsWhere<StoragePlan> | FindOptionsWhere<StoragePlan>[] = [
    { customer_order_number: ILike(`%${query}%`) },
    { order_number: ILike(`%${query}%`) },
  ];

  if (state.trim().length !== 0) {
    where = { state: ILike(`%${state}%`) };
  }

  if (current_user.customer_number) {
    where = { state: ILike(`%${state}%`), user_id: current_user.id };
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
      storage_state = array_states.find((s) => s.value === storage_plan.state);
    }
    data.push({
      ...storage_plan,
      warehouse,
      user,
      packing_list,
      storage_state,
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

export const countAllStoragePlan = async (
  current_user: any
): Promise<Object> => {
  const repository = AppDataSource.getRepository(StoragePlan);
  const total = await countStoragePlan();
  const to_be_storage = await getCountByState(
    repository,
    states.entry_plan.to_be_storage.value,
    current_user
  );
  const into_warehouse = await getCountByState(
    repository,
    states.entry_plan.into_warehouse.value,
    current_user
  );
  const cancelled = await getCountByState(
    repository,
    states.entry_plan.cancelled.value,
    current_user
  );
  const stocked = await getCountByState(
    repository,
    states.entry_plan.stocked.value,
    current_user
  );

  const result = {
    total,
    to_be_storage,
    into_warehouse,
    cancelled,
    stocked,
  };
  return result;
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
  /* if (data.customer_order_number) {
    const customer_order_number_count = await repository.count({
      where: { customer_order_number: data.customer_order_number },
    });
    if (customer_order_number_count > 0 && data.rejected_boxes !== true) {
      return { message: 'customer order number already exists' };
    }
  } */
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
  if (data.images) {
    data.is_images = true;
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

export const createStoragePlanMulti = async (data, user_id: number) => {
  const save_storage_plan = await createStoragePlan(data, user_id);

  if (save_storage_plan instanceof StoragePlan) {
    let package_list = [];
    for (let i = 0; i < save_storage_plan.box_amount; i++) {
      let position = i + 1;
      let value = String(position).padStart(data.digits_box_number, '0');
      const packing_list = {
        storage_plan_id: save_storage_plan.id,
        box_number: `${data.expansion_box_number}U${value}`,
        case_number: '',
        client_height: 0,
        client_length: 0,
        client_weight: 0,
        client_width: 0,
        amount: 0,
        product_name: '',
        english_product_name: '',
        price: 0,
        material: '',
        customs_code: '',
        fnscu: '',
        order_transfer_number: '',
        custome_picture: '',
        operator_picture: '',
      };
      const result = await createPackingList(packing_list);

      if (result instanceof PackingList) {
        package_list.push(result);
      } else {
        return {
          status: 1,
          message: 'There was a problem saving the package list',
        };
      }
    }
    if (package_list.length === save_storage_plan.box_amount) {
      return { status: 0, message: save_storage_plan };
    } else {
      return {
        status: 1,
        message: 'Unable to save all package lists',
      };
    }
  } else {
    return {
      status: 1,
      message: 'There was a problem saving the storage plan',
    };
  }
};
