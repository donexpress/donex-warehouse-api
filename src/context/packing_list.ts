import { ILike, In, Like, Not } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { PackingList } from '../models/packing_list.model';
import { StoragePlan } from '../models/storage_plan.model';
import { getDataByPackageId, getDataByPackagesIds } from './shelf_package';
import { calcDate, splitLastOccurrence } from '../helpers';
import { OutputPlan } from '../models/output_plan.model';
import states from '../config/states';

export const listPackingList = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  const packing_lists = await AppDataSource.manager.find(PackingList, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [{ box_number: ILike(`%${query}%`) }],
    order: {
      id: 'DESC',
    },
  });
  const mod_packing_list = [];
  for (let i = 0; i < packing_lists.length; i++) {
    const packing_list = packing_lists[i];
    const package_shelf = await getDataByPackageId(packing_list.id);
    mod_packing_list.push({ ...packing_list, package_shelf });
  }
  return mod_packing_list;
};

export const countPackingList = async () => {
  return AppDataSource.manager.count(PackingList);
};

export const showPackingList = async (id: number) => {
  const packing_list = await AppDataSource.manager.findOne(PackingList, {
    where: { id },
  });
  if (packing_list && packing_list.id) {
    const package_shelf = await getDataByPackageId(packing_list.id);
    return { ...packing_list, package_shelf };
  }
  return packing_list;
};

export const createPackingList = async (data) => {
  const storage_plan_repository = await AppDataSource.getRepository(
    StoragePlan
  );
  const storage_plan = await storage_plan_repository.findOne({
    where: { id: data.storage_plan_id },
  });
  if (!storage_plan) {
    return null;
  }
  const count = await countPackingList();
  let number = '';
  for (let i = 0; i < 3 - (count + 1).toString().length; i++) {
    number += '0';
  }
  data.case_number = `${storage_plan.order_number}U${number}${count + 1}`;
  if (!data.client_weight) {
    data.client_weight = 0;
  }
  if (!data.client_length) {
    data.client_length = 0;
  }
  if (!data.client_width) {
    data.client_width = 0;
  }
  if (!data.client_weight) {
    data.client_height = 0;
  }
  const repository = await AppDataSource.getRepository(PackingList);
  const packing_lists = await repository.find({
    where: {
      box_number: Like(`%${splitLastOccurrence(data.box_number, 'U')[0]}%`),
      storage_plan_id: Not(data.storage_plan_id),
    },
  });
  const ids: number[] = packing_lists.map(el => el.storage_plan_id)
  const plans = await storage_plan_repository.find({where: {id: In(ids)}})
  if (plans.filter(el => el.state !== states.entry_plan.cancelled.value).length === 0 || storage_plan.rejected_boxes) {
    const result = await repository.create(data);
    return await validateContext(AppDataSource, result);
  } else {
    return null;
  }
};

export const updatePackingList = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(PackingList);
  const old_data = await repository.findOne({ where: { id } });
  if (!old_data) {
    return null;
  }
  const storage_plan_repository = await AppDataSource.getRepository(
    StoragePlan
  );
  const storage_plan = await storage_plan_repository.findOne({
    where: { id: data.storage_plan_id },
  });
  if (!storage_plan) {
    return null;
  }
  if (!storage_plan.history) {
    storage_plan.history = [];
  }
  storage_plan.history.push({
    type: 'packing_list',
    data: { ...old_data, updated_at: new Date().toISOString() },
  });
  await storage_plan_repository.update({ id: storage_plan.id }, storage_plan);

  const result = await repository.update({ id }, data);
  return result;
};

export const removePackingList = async (id: number) => {
  const repository = await AppDataSource.getRepository(PackingList);
  const result = await repository.delete({ id });
  return result;
};

export const getPackingListByCaseNumber = async (case_number: string) => {
  const packing_list = await AppDataSource.manager.findOne(PackingList, {
    where: { case_number },
  });

  let package_shelf = null;
  if (packing_list) {
    package_shelf = await getDataByPackageId(packing_list.id);
  }
  return { ...packing_list, package_shelf };
};

export const getPackingListByBoxNumber = async (box_number: string) => {
  const packing_list = await AppDataSource.manager.findOne(PackingList, {
    where: { box_number },
  });

  let package_shelf = null;
  if (packing_list) {
    package_shelf = await getDataByPackageId(packing_list.id);
  }
  return { ...packing_list, package_shelf };
};

export const getPackingListByStoragePlanId = async (
  storage_plan_id: number
) => {
  const packing_list = await AppDataSource.manager.find(PackingList, {
    where: { storage_plan_id },
  });
  const output_plans = await AppDataSource.manager.find(OutputPlan);
  const mod_packing_list = [];
  for (let i = 0; i < packing_list.length; i++) {
    const pl = packing_list[i];
    const package_shelf = await getDataByPackageId(pl.id);
    let output_plan_delivered_number: null | string = null;
    output_plans.forEach((op) => {
      if (op.case_numbers.find((cn) => cn === pl.case_number) !== undefined) {
        output_plan_delivered_number = op.output_number;
      }
    });
    let storage_time = 0;
    if (package_shelf[0] && package_shelf[0].created_at) {
      const date = pl.dispatched_time
        ? pl.dispatched_time
        : new Date().toISOString();
      const storage_date = package_shelf[0].created_at;
      storage_time = calcDate(date, storage_date).total_days;
    }

    mod_packing_list.push({
      ...pl,
      package_shelf,
      output_plan_delivered_number,
      storage_time: storage_time
    });
  }
  return mod_packing_list;
};

export const chgeckPackingListCaseNumberByUser = async (
  case_number: string,
  user_id: number
): Promise<boolean> => {
  const packing_list = await AppDataSource.manager.findOne(PackingList, {
    where: { case_number },
  });
  if (!packing_list) {
    return false;
  }
  const storage_plan = await AppDataSource.manager.findOne(StoragePlan, {
    where: { id: packing_list.storage_plan_id },
  });
  return storage_plan.user_id === user_id;
};

export const exist_expansion_number = async (
  expansion_number: string,
  storage_plan_id: number
): Promise<boolean> => {
  const check_count = await AppDataSource.manager.count(PackingList, {
    where: {
      box_number: Like(`%${expansion_number}%`),
      storage_plan_id: Not(storage_plan_id),
    },
  });

  return check_count > 0;
};

export const isStored = async (case_number: string): Promise<boolean> => {
  const packing_list = await AppDataSource.manager.findOne(PackingList, {
    where: { case_number },
  });
  if (packing_list) {
    const package_shelf = await getDataByPackageId(packing_list.id);
    return package_shelf.length > 0;
  }
  return false;
};

export const dispatchBox = async (case_number: string) => {
  const repository = await AppDataSource.getRepository(PackingList);
  return repository.update(
    { case_number },
    { dispatched: true, dispatched_time: new Date().toISOString() }
  );
};

export const returnDispatchedBox = async (case_number: string) => {
  const repository = await AppDataSource.getRepository(PackingList);
  return repository.update(
    { case_number },
    { dispatched: false, dispatched_time: null }
  );
};

export const dispatchBulkBoxes = async (case_numbers: string[]) => {
  const repository = await AppDataSource.getRepository(PackingList);
  return repository.update(
    { case_number: In(case_numbers) },
    { dispatched: true, dispatched_time: new Date().toISOString() }
  );
};

export const returnDispatchedBulkBoxes = async (case_numbers: string[]) => {
  const repository = await AppDataSource.getRepository(PackingList);
  return repository.update(
    { case_number: In(case_numbers) },
    { dispatched: false, dispatched_time: null }
  );
};

export const createBulkPackingList = async (
  storage_plan_id: number,
  data: PackingList[]
) => {
  const storage_plan_repository = await AppDataSource.getRepository(
    StoragePlan
  );
  const storage_plan = await storage_plan_repository.findOne({
    where: { id: storage_plan_id },
  });
  const repository = await AppDataSource.getRepository(PackingList);
  const check_count = await repository.find({
    where: {
      storage_plan_id: Not(storage_plan_id),
    },
  });
  if (!storage_plan) {
    return null;
  }
  const to_add: PackingList[] = [];
  let count: number = await countPackingList();
  data.forEach((pl) => {
    let number = '';
    for (let i = 0; i < 3 - (count + 1).toString().length; i++) {
      number += '0';
    }
    pl.case_number = `${storage_plan.order_number}U${number}${count + 1}`;
    if (!pl.client_weight) {
      pl.client_weight = 0;
    }
    if (!pl.client_length) {
      pl.client_length = 0;
    }
    if (!pl.client_width) {
      pl.client_width = 0;
    }
    if (!pl.client_weight) {
      pl.client_height = 0;
    }
    if (
      check_count.filter((el) => el.box_number === pl.box_number).length ===
        0 ||
      storage_plan.rejected_boxes
    ) {
      to_add.push(pl);
      count++;
    }
  });
  const result = await repository.create(to_add);
  return await validateContext(AppDataSource, result);
};

export const getPackingListFromCaseNumbers = async (
  case_numbers: string[]
): Promise<PackingList[]> => {
  const package_list = await AppDataSource.manager.find(PackingList, {
    where: [{ case_number: In(case_numbers)},{ box_number: In(case_numbers) }],
  });
  const mod_packing_list = [];
  for (let i = 0; i < package_list.length; i++) {
    const element = package_list[i];
    const package_shelf = await getDataByPackageId(element.id);
    mod_packing_list.push({ ...element, package_shelf });
  }
  return mod_packing_list;
};

export const getPackingListByCaseNumbers = async (case_number: string[]) => {
  const packing_list = await AppDataSource.manager.find(PackingList, {
    where: { case_number: In(case_number) },
  });
  const package_shelf = await getDataByPackagesIds(
    packing_list.map((pl) => pl.id)
  );
  const mod_packing_list = [];
  packing_list.forEach((pl) => {
    const ps = package_shelf.find((l_ps) => l_ps.package_id === pl.id);
    if (!ps) {
      mod_packing_list.push(pl);
    } else {
      mod_packing_list.push({ ...pl, package_shelf: ps });
    }
  });
  return mod_packing_list;
};
