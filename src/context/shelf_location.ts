import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { ShelfLocation } from '../models/shelf_location.model';

export const listShelfLocation = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(ShelfLocation, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: 'ASC',
    },
  });
};

export const countShelfLocation = async () => {
  return AppDataSource.manager.count(ShelfLocation);
};

export const showShelfLocation = async (id: number) => {
  return await AppDataSource.manager.findOne(ShelfLocation, {
    where: { id },
  });
};

export const createShelfLocation = async (data) => {
  const repository = await AppDataSource.getRepository(ShelfLocation);
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updateShelfLocation = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(ShelfLocation);
  const result = await repository.update({ id }, data);
  return result;
};

export const removeShelfLocation = async (id: number) => {
  const repository = await AppDataSource.getRepository(ShelfLocation);
  const result = await repository.delete({ id });
  return result;
};
