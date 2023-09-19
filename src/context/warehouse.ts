import { FindOptionsWhere, Not } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import states from '../config/states';
import { object_state_warehouse } from '../helpers/states';
import { validateContext } from '../helpers/validate';
import { Warehouse } from '../models/warehouse.model';
import { WarehouseState } from '../models/warehouse_state.model';

export const listWarehouse = async (
  current_page: number,
  number_of_rows: number,
  state: string = ''
) => {
  const skip = ((current_page - 1) * number_of_rows) | 0;
  const take = number_of_rows | 10;
  const not_deleted = Not('deleted');

  let where: FindOptionsWhere<Warehouse> | FindOptionsWhere<Warehouse>[] = {
    state: not_deleted,
  };

  if (state !== '') {
    where = { state };
  }

  const warehouses = await AppDataSource.manager.find(Warehouse, {
    take: take,
    skip: skip,
    where,
    order: {
      id: 'DESC',
    },
  });
  const mod_warehouses = warehouses.map((warehouse) => {
    if (warehouse.state) {
      return {
        ...warehouse,
        ...{ state: object_state_warehouse(warehouse.state) },
      };
    } else {
      return { ...warehouse, ...{ state: null } };
    }
  });
  return mod_warehouses;
};

export const countWarehouse = async () => {
  return await AppDataSource.getRepository(Warehouse).count({
    where: { state: Not('deleted') },
  });
};

export const showWarehouse = async (id: number) => {
  const warehouse = await AppDataSource.manager.findOne(Warehouse, {
    where: { id },
    // relations: ['states'],
  });

  //const states = await AppDataSource.manager.find(WarehouseState);
  if (warehouse.state) {
    return {
      ...warehouse,
      ...{ state: object_state_warehouse(warehouse.state) },
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
  const name_count = await repository.count({
    where: { name: warehouse_data.name, id: Not(id) },
  });
  if (name_count > 0) {
    return { message: 'name already exists' };
  }
  if (warehouse_data.english_name) {
    const english_name_count = await repository.count({
      where: { english_name: warehouse_data.english_name, id: Not(id) },
    });
    if (english_name_count > 0) {
      return { message: 'english name already exists' };
    }
  }
  const result = await repository.update({ id }, warehouse_data);
  return result;
};

export const removeWarehouse = async (id: number) => {
  const repository = await AppDataSource.getRepository(Warehouse);
  //const result = await repository.delete({ id });
  const warehouse = await repository.update(
    { id },
    {
      state: 'deleted',
    }
  );
  return warehouse;
};
