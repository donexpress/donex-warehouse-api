import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Shelf } from '../models/shelf.model';

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
  return await AppDataSource.manager.findOne(Shelf, {
    where: { id },
  });
};

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
