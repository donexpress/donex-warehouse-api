import { ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { PackingList } from '../models/packing_list.model';
import { StoragePlan } from '../models/storage_plan.model';
import { getDataByPackageId } from './shelf_package';

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
  const mod_packing_list = []
  for (let i = 0; i < packing_lists.length; i++) {
    const packing_list = packing_lists[i];
    const package_shelf = await getDataByPackageId(packing_list.id)
    mod_packing_list.push({...packing_list, package_shelf})
  }
  return mod_packing_list
};

export const countPackingList = async () => {
  return AppDataSource.manager.count(PackingList);
};

export const showPackingList = async (id: number) => {
  const packing_list = await AppDataSource.manager.findOne(PackingList, {
    where: { id },
  });
  if(packing_list && packing_list.id) {
    const package_shelf = await getDataByPackageId(packing_list.id)
    return {...packing_list, package_shelf}
  }
  return packing_list
};

export const createPackingList = async (data) => {
  const storage_plan_repository = await AppDataSource.getRepository(StoragePlan)
  const storage_plan = await storage_plan_repository.findOne({where: {id: data.storage_plan_id} })
  if(!storage_plan) {
    return null
  }
  const count = await countPackingList()
  let number = ''
  for (let i = 0; i < 3 - (count+1).toString().length; i++) {
    number+='0'
  }
  data.case_number = `${storage_plan.order_number}U${number}${count+1}`
  const repository = await AppDataSource.getRepository(PackingList);
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updatePackingList = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(PackingList);
  const old_data = await repository.findOne({where: {id}})
  if(!old_data) {
    return null
  }
  const storage_plan_repository = await AppDataSource.getRepository(StoragePlan)
  const storage_plan = await storage_plan_repository.findOne({where: {id: data.storage_plan_id} })
  if(!storage_plan) {
    return null
  }
  if(!storage_plan.history) {
    storage_plan.history = []
  }
  storage_plan.history.push({type: 'packing_list', data: {...old_data, updated_at: new Date().toISOString()}})
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
  const package_shelf = await getDataByPackageId(packing_list.id)
  return {...packing_list, package_shelf}
};

export const getPackingListByStoragePlanId = async (storage_plan_id: number) => {
  const packing_list = await AppDataSource.manager.find(PackingList, {
    where: { storage_plan_id },
  });
  const mod_packing_list = []
  for (let i = 0; i < packing_list.length; i++) {
    const pl = packing_list[i];
    const package_shelf = await getDataByPackageId(pl.id)
    mod_packing_list.push({...pl, package_shelf})
  }
  return mod_packing_list
};