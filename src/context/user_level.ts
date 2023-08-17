import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { UserLevel } from '../models/user_level.model';

export const listUserLevel = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(UserLevel, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: 'ASC',
    },
    relations: ['services'],
  });
};

export const countUserLevel = async () => {
  return AppDataSource.manager.count(UserLevel);
};

export const showUserLevel = async (id: number) => {
  return await AppDataSource.manager.findOne(UserLevel, {
    where: { id },
    relations: ['services'],
  });
};

export const createUserLevel = async (user_level_data) => {
  const repository = await AppDataSource.getRepository(UserLevel);
  const service = repository.create(user_level_data);
  return await validateContext(AppDataSource, service);
};

export const updateUserLevel = async (id: number, user_level_data) => {
  const repository = await AppDataSource.getRepository(UserLevel);
  const result = await repository.update({ id }, user_level_data);
  return result;
};

export const removeUserLevel = async (id: number) => {
  const repository = await AppDataSource.getRepository(UserLevel);
  const result = await repository.delete({ id });
  return result;
};
