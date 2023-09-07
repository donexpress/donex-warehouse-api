import { ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { AOSWarehouse } from '../models/aos_warehouse.model';
import { Shelf } from '../models/shelf.model';

export const listAOSWarehouse = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  const aos_warehouses = await AppDataSource.manager.find(AOSWarehouse, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [{ name: ILike(`%${query}%`) }, { code: ILike(`%${query}%`) }],
    order: {
      id: 'DESC',
    },
  });
  const shelfs_data = await AppDataSource.manager.find(Shelf)
  const mod_aos_warehouses = []
  aos_warehouses.map(warehouse => {
    let shelfs = shelfs_data.filter(shelf => shelf.warehouse_id === warehouse.id)
    mod_aos_warehouses.push({...warehouse, shelfs})
  })
  return mod_aos_warehouses
};

export const countAOSWarehouse = async () => {
  return AppDataSource.manager.count(AOSWarehouse);
};

export const showAOSWarehouse = async (id: number) => {
  const aos_warehouse = await AppDataSource.manager.findOne(AOSWarehouse, {
    where: { id },
  });
  const shelfs = await AppDataSource.manager.find(Shelf, {where: {warehouse_id: aos_warehouse.id}})
  return {...aos_warehouse, shelfs}
};

export const createAOSWarehouse = async (aos_warehouse_data: any) => {
  if(aos_warehouse_data.email === '') {
    aos_warehouse_data.email = null
  }
  const repository = await AppDataSource.getRepository(AOSWarehouse);
  const aos_warehouse = repository.create(aos_warehouse_data);
  return await validateContext(AppDataSource, aos_warehouse);
};

export const updateAOSWarehouse = async (id: number, aos_warehouse_data) => {
  const repository = await AppDataSource.getRepository(AOSWarehouse);
  const result = await repository.update({ id }, aos_warehouse_data);
  return result;
};

export const removeAOSWarehouse = async (id: number) => {
  const repository = await AppDataSource.getRepository(AOSWarehouse);
  const result = await repository.delete({ id });
  return result;
};
