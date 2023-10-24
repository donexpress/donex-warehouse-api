import { In } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { PackingList } from '../models/packing_list.model';
import { Shelf } from '../models/shelf.model';
import { ShelfPackages } from '../models/shelf_package.model';
import { StoragePlan } from '../models/storage_plan.model';
import { showShelf } from './shelf';

export const listShelfPackages = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(ShelfPackages, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: 'DESC',
    },
  });
};

export const countShelfPackages = async () => {
  return AppDataSource.manager.count(ShelfPackages);
};

export const showShelfPackage = async (id: number) => {
  const shelf_package = await AppDataSource.manager.findOne(ShelfPackages, {
    where: { id },
  });
  const shelf = await AppDataSource.manager.findOne(Shelf, {
    where: { id: shelf_package.shelf_id },
  });
  const packages = await AppDataSource.manager.findOne(PackingList, {
    where: { id: shelf_package.package_id },
  });
  return { ...shelf_package, shelf, package: packages };
};

export const getDataByShelfId = async (id: number) => {
  const shelf_packages = await AppDataSource.manager.find(ShelfPackages, {
    where: { shelf_id: id },
  });
  const mod_data = [];
  for (let i = 0; i < shelf_packages.length; i++) {
    const packages = await AppDataSource.manager.findOne(PackingList, {
      where: { id: shelf_packages[i].package_id },
    });
    mod_data.push({ ...shelf_packages[i], package: packages });
  }
  return mod_data;
};

export const getDataByPackageId = async (id: number) => {
  const shelf_packages = await AppDataSource.manager.find(ShelfPackages, {
    where: { package_id: id },
  });
  const mod_data = [];
  for (let i = 0; i < shelf_packages.length; i++) {
    const shelf = await AppDataSource.manager.findOne(Shelf, {
      where: { id: shelf_packages[i].shelf_id },
    });
    if (!shelf) {
      mod_data.push(shelf_packages[i])
    } else {
      mod_data.push({ ...shelf_packages[i], shelf });
    }
  }
  return mod_data;
};

export const createShelfPackages = async (data) => {
  const repository = await AppDataSource.getRepository(ShelfPackages);
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updateShelfPackages = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(ShelfPackages);
  const old_data = await showShelfPackage(id)
  const packing_list = await AppDataSource.manager.findOne(PackingList, {where: {id: old_data.package_id}})
  const storage_plan_repository = await AppDataSource.getRepository(StoragePlan);
  const storage_plan = await storage_plan_repository.findOne({where: {id: packing_list.storage_plan_id}})
  storage_plan.history.push({
    type: 'shelf_package',
    data: { ...old_data, updated_at: new Date().toISOString() },
  });
  await storage_plan_repository.update({ id: storage_plan.id }, storage_plan);
  const result = await repository.update({ id }, data);
  return result;
};

export const removeShelfPackages = async (id: number) => {
  const repository = await AppDataSource.getRepository(ShelfPackages);
  const result = await repository.delete({ id });
  return result;
};

export const getDataByPackagesIds = async (ids: number[]) => {
  const shelf_packages = await AppDataSource.manager.find(ShelfPackages, {
    where: { package_id: In(ids) },
  });
  const shelfs = await AppDataSource.manager.find(Shelf);
  const mod_data = [];
  for (let i = 0; i < shelf_packages.length; i++) {
    const shelf = shelfs.find(el => el.id === shelf_packages[i].shelf_id)
    if (!shelf) {
      mod_data.push(shelf_packages[i])
    } else {
      mod_data.push({ ...shelf_packages[i], shelf });
    }
  }
  return mod_data;
};