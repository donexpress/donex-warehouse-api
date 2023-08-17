import { ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { AOSWarehouse } from '../models/aos_warehouse.model';

export const listAOSWarehouse = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  return AppDataSource.manager.find(AOSWarehouse, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [{ name: ILike(`%${query}%`) }, { code: ILike(`%${query}%`) }],
    order: {
      id: 'ASC',
    },
  });
};

export const countAOSWarehouse = async () => {
  return AppDataSource.manager.count(AOSWarehouse);
};

export const showAOSWarehouse = async (id: number) => {
  return await AppDataSource.manager.findOne(AOSWarehouse, {
    where: { id },
  });
};

export const createAOSWarehouse = async (aos_warehouse_data) => {
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
