import { AppDataSource } from '../config/ormconfig';
import { WarehouseState } from '../models/warehouse_state.model';
import { validateContext } from '../helpers/validate';

export const listWarehouseState = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(WarehouseState, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: 'ASC',
    },
  });
};

export const countWarehouseState = async () => {
  return AppDataSource.manager.count(WarehouseState);
};

export const showWarehouseState = async (id: number) => {
  return await AppDataSource.manager.findOne(WarehouseState, {
    where: {
      id: Number(id),
    },
  });
};

export const createWarehouseState = async (warehouse_state_data) => {
  const repository = await AppDataSource.getRepository(WarehouseState);
  const warehouse = repository.create(warehouse_state_data);
  return await validateContext(AppDataSource, warehouse);
};

export const updateWarehouseState = async (
  id: number,
  warehouse_state_data
) => {
  const repository = await AppDataSource.getRepository(WarehouseState);
  const result = await repository.update({ id }, warehouse_state_data);
  return result;
};

export const removeWarehouseState = async (id: number) => {
  const repository = await AppDataSource.getRepository(WarehouseState);
  const result = await repository.delete({ id });
  return result;
};
