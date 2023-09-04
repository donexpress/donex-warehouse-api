import { ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { StoragePlanState } from '../models/storage_plan_state.model';

export const listStoragePlanState = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  const storage_plan_types = await AppDataSource.manager.find(StoragePlanState, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [
      { name: ILike(`%${query}%`) },
    ],
    order: {
      id: 'ASC',
    },
  });

  return storage_plan_types
};

export const countStoragePlanState = async () => {
  return AppDataSource.manager.count(StoragePlanState);
};

export const showStoragePlanState = async (id: number) => {
  const storage_plan = await AppDataSource.manager.findOne(StoragePlanState, {
    where: { id },
  });
  return storage_plan
};

export const createStoragePlanState = async (data, user_id: number) => {
  const repository = await AppDataSource.getRepository(StoragePlanState);
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updateStoragePlan = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(StoragePlanState);
  const result = await repository.update(
    { id },
    { ...data, updated_at: new Date().toDateString() }
  );
  return result;
};

export const removeStoragePlan = async (id: number) => {
  const repository = await AppDataSource.getRepository(StoragePlanState);
  const result = await repository.delete({ id });
  return result;
};
