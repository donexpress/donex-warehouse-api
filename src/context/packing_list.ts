import { ILike, In, Like, Not } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { PackingList } from '../models/packing_list.model';
import { StoragePlan } from '../models/storage_plan.model';
import { getDataByPackageId } from './shelf_package';
import { splitLastOccurrence } from '../helpers';

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
  const check_count = await repository.count({
    where: {
      box_number: Like(`%${splitLastOccurrence(data.box_number, 'U')[0]}%`),
      storage_plan_id: Not(data.storage_plan_id),
    },
  });
  if (check_count === 0 || storage_plan.rejected_boxes) {
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
  const mod_packing_list = [];
  for (let i = 0; i < packing_list.length; i++) {
    const pl = packing_list[i];
    const package_shelf = await getDataByPackageId(pl.id);
    mod_packing_list.push({ ...pl, package_shelf });
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
    if(check_count.filter(el => el.box_number === pl.box_number).length === 0 || storage_plan.rejected_boxes) {
      to_add.push(pl)
      count ++;
    }
  });
  const result = await repository.create(to_add)
  return await validateContext(AppDataSource, result)
};

export const getPackingListFromCaseNumbers = async(case_numbers: string[]): Promise<PackingList[]> => {
  const package_list = await AppDataSource.manager.find(PackingList, {where:{case_number: In(case_numbers)}})
  const mod_packing_list = []
  for (let i = 0; i < package_list.length; i++) {
    const element = package_list[i];
    const package_shelf = await getDataByPackageId(element.id);
    mod_packing_list.push({ ...element, package_shelf });
  }
  return mod_packing_list
}
