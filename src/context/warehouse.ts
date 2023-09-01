import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Warehouse } from '../models/warehouse.model';
import { WarehouseState } from '../models/warehouse_state.model';

export const listWarehouse = async (
  current_page: number,
  number_of_rows: number
) => {
  const warehouses = await AppDataSource.manager.find(Warehouse, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: 'ASC',
    },
    // relations: ['states'],
  });
  const states = await AppDataSource.manager.find(WarehouseState);
  const mod_warehouses = warehouses.map((warehouse) => {
    if (warehouse.state_id) {
      return {
        ...warehouse,
        ...{ state: states.find((el) => el.id === warehouse.state_id) },
      };
    } else {
      return { ...warehouse, ...{ state: null } };
    }
  });
  return mod_warehouses;
};

export const countWarehouse = async () => {
  return AppDataSource.manager.count(Warehouse);
};

export const showWarehouse = async (id: number) => {
  const warehouse = await AppDataSource.manager.findOne(Warehouse, {
    where: { id },
    // relations: ['states'],
  });

  const states = await AppDataSource.manager.find(WarehouseState);
  if (warehouse.state_id) {
    return {
      ...warehouse,
      ...{ state: states.find((el) => el.id === warehouse.state_id) },
    };
  } else {
    return { ...warehouse, ...{ state: null } };
  }
};

export const createWarehouse = async (warehouse_data) => {
  const repository = await AppDataSource.getRepository(Warehouse);
  const name_count = await repository.count({
    where: { name: warehouse_data.name },
  });
  if (name_count > 0) {
    return { message: 'name already exists' };
  }
  if (warehouse_data.english_name) {
    const english_name_count = await repository.count({
      where: { english_name: warehouse_data.english_name },
    });
    if (english_name_count > 0) {
      return { message: 'english name already exists' };
    }
  }
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
