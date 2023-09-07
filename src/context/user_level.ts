import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Service } from '../models/service.model';
import { UserLevel } from '../models/user_level.model';

export const listUserLevel = async (
  current_page: number,
  number_of_rows: number
) => {
  const user_level = await AppDataSource.manager.find(UserLevel, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: 'DESC',
    },
    // relations: ['services'],
  });
  const services = await AppDataSource.manager.find(Service)
  const mod_user_level = user_level.map(user_level => {
    if(user_level.service_id) {
      return {...user_level, ...{service: services.find(el => el.id === user_level.service_id)}}
    } else {
      return {...user_level, ...{service: null}}
    }
  })
  return mod_user_level
};

export const countUserLevel = async () => {
  return AppDataSource.manager.count(UserLevel);
};

export const showUserLevel = async (id: number) => {
  const services = await AppDataSource.manager.find(Service)
  const user_level = await AppDataSource.manager.findOne(UserLevel, {
    where: { id },
    // relations: ['services'],
  });
  if(user_level.service_id) {
    return {...user_level, ...{service: services.find(el => el.id === user_level.service_id)}}
  } else {
    return user_level
  }
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
