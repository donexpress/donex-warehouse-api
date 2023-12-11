import { FindOptionsWhere, ILike, In, Not } from 'typeorm';
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
import { removeNullProperties } from '../helpers';
import {
  findShelfByWarehouseId,
} from './shelf';
import { ShelfPackages } from '../models/shelf_package.model';

export const listStoragePlan = async (
  current_page: number,
  number_of_rows: number,
  query: Partial<StoragePlan>,
  current_user
) => {

  const where  = getWhereFilter(query, current_user)
  
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
  current_user: any,
  filter: Partial<StoragePlan>
): Promise<Object> => {
  const repository = AppDataSource.getRepository(StoragePlan);
  const total = await countStoragePlan();
  const to_be_storage = await getCountByState(
    repository,
    await getWhereFilter({...filter, state: states.entry_plan.to_be_storage.value}, current_user)
  );
  const into_warehouse = await getCountByState(
    repository,
    await getWhereFilter({...filter, state: states.entry_plan.into_warehouse.value}, current_user)
  );
  const cancelled = await getCountByState(
    repository,
    await getWhereFilter({...filter, state: states.entry_plan.cancelled.value}, current_user)
  );
  const stocked = await getCountByState(
    repository,
    await getWhereFilter({...filter, state: states.entry_plan.stocked.value}, current_user)
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

export const getWhere = async (current_user, query, state_value) => {
  let where: FindOptionsWhere<StoragePlan> | FindOptionsWhere<StoragePlan>[] = {
    state: state_value,
  };
  if (current_user.customer_number) {
    where = [
      {
        customer_order_number: ILike(`%${query}%`),
        state: state_value,
        user_id: current_user.id,
      },
      {
        order_number: ILike(`%${query}%`),
        state: state_value,
        user_id: current_user.id,
      },
      {
        pr_number: ILike(`%${query}%`),
        state: state_value,
        user_id: current_user.id,
      },
      {
        reference_number: ILike(`%${query}%`),
        state: state_value,
        user_id: current_user.id,
      },
    ];
  } else {
    where = [
      { customer_order_number: ILike(`%${query}%`), state: state_value },
      { order_number: ILike(`%${query}%`), state: state_value },
      { pr_number: ILike(`%${query}%`), state: state_value },
      { reference_number: ILike(`%${query}%`), state: state_value },
    ];
  }

  return where;
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

export const showCleanStoragePlan = async (id: number) => {
  const storage_plan = await AppDataSource.manager.findOne(StoragePlan, {
    where: { id },
  });
  return removeNullProperties(storage_plan);
};

export const createStoragePlan = async (data, user_id: number) => {
  const repository = await AppDataSource.getRepository(StoragePlan);
  if (data.delivered_time === '') {
    data.delivered_time = null;
  }
  if (data.customer_order_number) {
    const customer_order_number_count = await repository.count({
      where: {
        customer_order_number: data.customer_order_number,
        state: Not(states.entry_plan.cancelled.value),
      },
    });
    if (customer_order_number_count > 0 && data.rejected_boxes !== true) {
      return { message: 'customer order number already exists' };
    }
  }
  const date = new Date();
  const month =
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const count = await countStoragePlan();
  data.order_number = '';
  // let number = '';
  // for (let i = 0; i < 6 - (count + 1).toString().length; i++) {
  //   number += '0';
  // }
  // data.order_number = `DEWMXI${date.getFullYear()}${month}${date.getDate()}${number}${
  //   count + 1
  // }`;
  if (!data.user_id) {
    data.user_id = user_id;
  }
  if (data.images) {
    data.is_images = true;
  }
  const result = repository.create(data);
  const validated = await validateContext(AppDataSource, result);
  if (validated instanceof StoragePlan) {
    const on = `DEWMXI${date.getFullYear()}${month}${
      date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()
    }${validated.id.toString().padStart(6, '0')}`;
    await repository.update({ id: validated.id }, { order_number: on });
    validated.order_number = on;
  }
  return validated;
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
  const packing_list_repository = await AppDataSource.getRepository(
    PackingList
  );
  const packing_lists = await packing_list_repository.find({
    where: { storage_plan_id: id },
  });
  const shelf_package_repository = await AppDataSource.getRepository(
    ShelfPackages
  );
  await shelf_package_repository.delete({
    package_id: In(packing_lists.map((el) => el.id)),
  });
  await packing_list_repository.delete({ storage_plan_id: id });
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
        return result.message;
      }
    }
    if (package_list.length === save_storage_plan.box_amount) {
      return save_storage_plan;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const changeStoragePlanState = async (id: number, state) => {
  const repository = await AppDataSource.getRepository(StoragePlan);
  const old_data = await repository.findOne({ where: { id } });
  if (!old_data) {
    return null;
  }
  delete old_data.history;
  const result = await repository.update(
    { id },
    { state, updated_at: new Date().toISOString() }
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

export const filterStoragePlan = async (query: string) => {
  let where: FindOptionsWhere<StoragePlan> | FindOptionsWhere<StoragePlan>[] = [
    { customer_order_number: query },
    { order_number: query },
  ];

  const storage_plans = await AppDataSource.manager.find(StoragePlan, {
    where,
    order: {
      id: 'DESC',
    },
  });

  const data = [];
  for (let i = 0; i < storage_plans.length; i++) {
    const storage_plan = storage_plans[i];
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
      packing_list,
      storage_state,
    });
  }
  return data;
};

export const getStoragePlansbyIds = async (ids: number[]) => {
  const storage_plans = await AppDataSource.manager.find(StoragePlan, {
    where: { id: In(ids) },
  });
  return storage_plans;
};

export const full_assign = async (
  storage_plan_id: number,
  box_ids: number[] | undefined | null
) => {
  let added = false;
  const storage_plan = await AppDataSource.manager.findOne(StoragePlan, {
    where: { id: storage_plan_id },
  });
  if (!storage_plan) {
    return { state: 404, exist_empty: false };
  }
  let where: FindOptionsWhere<PackingList> = {};
  if (box_ids && box_ids.length > 0) {
    where = { storage_plan_id: storage_plan.id, id: In(box_ids)};
  } else {
    where = { storage_plan_id: storage_plan.id };
  }
  const packages_list = await AppDataSource.manager.find(PackingList, {
    where,
  });
  const shelfs = await findShelfByWarehouseId(storage_plan.warehouse_id);
  console.log(!shelfs || !packages_list);
  if (!shelfs || !packages_list) {
    return { state: 404, exist_empty: false };
  }
  const package_shelf_repository = await AppDataSource.getRepository(
    ShelfPackages
  );
  let check_shelves = shelfs;
  let partition_count = 1;
  while (check_shelves.length > 0) {
    console.log(`check shelves ammount: `, check_shelves.length);
    const selected_shelves = check_shelves.filter(
      (el) => el.partition_table === partition_count
    );
    console.log(`selected shelves ammount: `, selected_shelves.length);
    for (let i = 0; i < selected_shelves.length; i++) {
      const shelf = selected_shelves[i];
      // check used layers and columns
      let layer_id_used: { layer: number; column: number }[] = [];
      let packages = await AppDataSource.manager.find(ShelfPackages, {
        where: { shelf_id: shelf.id },
      });
      const packages_list_dispatched = await AppDataSource.manager.find(PackingList, {
        where: {id: In(packages.map(el => el.package_id)), dispatched: true},
      });

      packages = packages.filter(p => packages_list_dispatched.find(pld => p.package_id === pld.id) === undefined )

      console.log(
        `Ammount of packages: `,
        packages.length
      );
      packages.forEach((p) => {
        if (
          layer_id_used.filter(
            (el) => el.layer === p.layer && el.column === p.column
          ).length === 0
        ) {
          layer_id_used.push({ layer: p.layer, column: p.column });
        }
      });
      console.log(layer_id_used)
      for (let j = 1; j <= shelf.layers && !added; j++) {
        for (let k = 1; k <= shelf.column_ammount && !added; k++) {
          if (
            layer_id_used.find((el) => el.layer === j && el.column === k) ===
            undefined
          ) {
            console.log({packages: packages_list.length})
            for (let l = 0; l < packages_list.length; l++) {
              const package_list = packages_list[l];
              console.log({package_id: package_list.id})
              await package_shelf_repository.delete({package_id: package_list.id})
              const result = await package_shelf_repository.create({
                column: k,
                layer: j,
                package_id: package_list.id,
                shelf_id: shelf.id,
              });
              const validate = await validateContext(AppDataSource, result);
            }
            return { state: 200, exist_empty: true };
          }
        }
      }
    }
    check_shelves = check_shelves.filter(
      (el) => el.partition_table !== partition_count
    );
    partition_count++;
    console.log(partition_count);
  }

  return { state: 200, exist_empty: added };
};

export const getWhereFilter = (query: Partial<StoragePlan>, current_user) => {
  let where: FindOptionsWhere<StoragePlan> | FindOptionsWhere<StoragePlan>[] = {}
  if(query.box_amount) {
    where.box_amount = query.box_amount;
  }
  if(query.country) {
    where.country = query.country;
  }
  if(query.customer_order_number) {
    where.customer_order_number = ILike(`%${query.customer_order_number}%`);
  }
  if(query.is_images) {
    where.is_images = query.is_images;
  }
  if(query.observations) {
    where.observations = ILike(`%${query.observations}%`)
  }
  if(query.order_number) {
    where.order_number = ILike(`%${query.order_number}%`)
  }
  if(query.out_boxes) {
    where.out_boxes = query.out_boxes
  }
  if(query.pr_number) {
    where.pr_number = query.pr_number
  }
  if(query.ready) {
    where.ready = query.ready
  }
  if(query.reference_number) {
    where.reference_number = query.reference_number
  }
  if(query.rejected_boxes) {
    where.rejected_boxes = query.rejected_boxes
  }
  if(query.return) {
    where.return = query.return
  }
  if(query.state) {
    where.state = query.state
  }
  if(query.stock_boxes) {
    where.stock_boxes = query.stock_boxes
  }
  if(current_user.customer_number) {
    where.user_id = current_user.id
  }
  return where;
}