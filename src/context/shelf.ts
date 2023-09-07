import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Shelf } from '../models/shelf.model';
import { ShelfPackages } from '../models/shelf_package.model';
import { getDataByShelfId } from './shelf_package';

export const listShelf = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(Shelf, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: 'ASC',
    },
  });
};

export const countShelf = async () => {
  return AppDataSource.manager.count(Shelf);
};

export const showShelf = async (id: number) => {
  const shelf = await AppDataSource.manager.findOne(Shelf, {
    where: { id },
  });
  const package_shelf = await AppDataSource.manager.find(ShelfPackages, {where: {shelf_id: id}})
  return {...shelf, packages: package_shelf}
};

export const findShelfByWarehouseId = async(id: number) => {
  const shelfs = await AppDataSource.manager.find(Shelf, {where: {warehouse_id: id}})
  const package_shelf = await AppDataSource.manager.find(ShelfPackages)
  const mod_shelfs = []
  for (let i = 0; i < shelfs.length; i++) {
    const shelf = shelfs[i];
    const packages = await getDataByShelfId(shelf.id)
    mod_shelfs.push({...shelf, packages})
    
  }
  return mod_shelfs
}

export const createShelf = async (data) => {
  const repository = await AppDataSource.getRepository(Shelf);
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updateShelf = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(Shelf);
  const result = await repository.update({ id }, data);
  return result;
};

export const removeShelf = async (id: number) => {
  const repository = await AppDataSource.getRepository(Shelf);
  const result = await repository.delete({ id });
  return result;
};
