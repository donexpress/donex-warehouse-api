import { ILike, Not } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { AOSWarehouse } from '../models/aos_warehouse.model';
import { Shelf } from '../models/shelf.model';
import { findShelfByWarehouseId } from './shelf';

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
  const shelfs_data = await AppDataSource.manager.find(Shelf, {
    order: { partition_table: 'ASC' },
  });
  const mod_aos_warehouses = [];
  aos_warehouses.map((warehouse) => {
    let shelfs = shelfs_data.filter(
      (shelf) => shelf.warehouse_id === warehouse.id
    );
    let patition_amount = 0;
    if (
      shelfs[shelfs.length - 1] &&
      shelfs[shelfs.length - 1].partition_table
    ) {
      shelfs.forEach((shelf) => {
        if (shelf.partition_table > patition_amount) {
          patition_amount = shelf.partition_table;
        }
      });
    }
    mod_aos_warehouses.push({ ...warehouse, shelfs, patition_amount });
  });
  return mod_aos_warehouses;
};

export const countAOSWarehouse = async () => {
  return AppDataSource.manager.count(AOSWarehouse);
};

export const showAOSWarehouse = async (id: number) => {
  const aos_warehouse = await AppDataSource.manager.findOne(AOSWarehouse, {
    where: { id },
  });
  const shelfs = await findShelfByWarehouseId(id);
  let patition_amount = 0;
  if (shelfs[shelfs.length - 1] && shelfs[shelfs.length - 1].partition_table) {
    shelfs.forEach((shelf) => {
      if (shelf.partition_table > patition_amount) {
        patition_amount = shelf.partition_table;
      }
    });
  }
  return { ...aos_warehouse, shelfs, patition_amount };
};

export const createAOSWarehouse = async (aos_warehouse_data: any) => {
  if (aos_warehouse_data.email === '') {
    aos_warehouse_data.email = null;
  }
  const repository = await AppDataSource.getRepository(AOSWarehouse);
  const name_count = await repository.count({
    where: { name: aos_warehouse_data.name },
  });
  if (name_count > 0) {
    return { message: 'name already exists' };
  }
  const aos_warehouse = repository.create(aos_warehouse_data);
  return await validateContext(AppDataSource, aos_warehouse);
};

export const updateAOSWarehouse = async (id: number, aos_warehouse_data) => {
  const repository = await AppDataSource.getRepository(AOSWarehouse);
  const name_count = await repository.count({
    where: { name: aos_warehouse_data.name, id: Not(id) },
  });
  if (name_count > 0) {
    return { message: 'name already exists' };
  }
  if(aos_warehouse_data.code) {
    const code_count = await repository.count({where: {code: aos_warehouse_data.code, id: Not(id)}})
    if(code_count > 0) {
      return { message: 'name already exists' };
  }
  }
  const result = await repository.update({ id }, aos_warehouse_data);
  return result;
};

export const removeAOSWarehouse = async (id: number) => {
  const repository = await AppDataSource.getRepository(AOSWarehouse);
  const result = await repository.delete({ id });
  return result;
};

export const getAosWarehouseByCode = async (code: string): Promise<AOSWarehouse> => {
  return await AppDataSource.manager.findOne(AOSWarehouse, {
    where: {
      code: code,
    },
  });
};


export const selectAOSWarehouse = async () => {
  const aos_warehouses = await AppDataSource.manager.find(AOSWarehouse, {
    select: {
      id: true,
      code: true,
    },
    order: {
      id: 'DESC',
    },
  });
  return aos_warehouses;
};