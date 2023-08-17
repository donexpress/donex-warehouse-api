import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Warehouse } from '../models/warehouse.model';

export const listWarehouse = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(Warehouse, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: 'ASC',
    },
    // relations: ['states'],
  });
};

export const countWarehouse = async () => {
  return AppDataSource.manager.count(Warehouse);
};

export const showWarehouse = async (id: number) => {
  return await AppDataSource.manager.findOne(Warehouse, {
    where: { id },
    // relations: ['states'],
  });
};

export const createWarehouse = async (warehouse_data) => {
  const repository = await AppDataSource.getRepository(Warehouse);
  const warehouse = repository.create(warehouse_data);
  return await validateContext(AppDataSource, warehouse);
};

export const updateWarehouse = async (id: number, warehouse_data) => {
  const repository = await AppDataSource.getRepository(Warehouse);
  const result = await repository.update({ id }, warehouse_data);
  return result;
};

export const removeWarehouse = async (id: number) => {
  const repository = await AppDataSource.getRepository(Warehouse);
  const result = await repository.delete({ id });
  return result;
};
