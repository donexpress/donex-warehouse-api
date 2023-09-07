import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { ShelfType } from '../models/shelf_type.model';

export const listShelfType = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(ShelfType, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: 'DESC',
    },
  });
};

export const countShelfType = async () => {
  return AppDataSource.manager.count(ShelfType);
};

export const showShelfType = async (id: number) => {
  return await AppDataSource.manager.findOne(ShelfType, {
    where: { id },
  });
};

export const createShelfType = async (data) => {
  const repository = await AppDataSource.getRepository(ShelfType);
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updateShelfType = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(ShelfType);
  const result = await repository.update({ id }, data);
  return result;
};

export const removeShelfType = async (id: number) => {
  const repository = await AppDataSource.getRepository(ShelfType);
  const result = await repository.delete({ id });
  return result;
};
