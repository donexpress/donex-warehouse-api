import { ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { StoragePlan } from '../models/storage_plan.model';

export const listStoragePlan = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  return AppDataSource.manager.find(StoragePlan, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [{ customer_order_number: ILike(`%${query}%`) }, { order_number: ILike(`%${query}%`) }],
    order: {
      id: 'ASC',
    },
  });
};

export const countStoragePlan = async () => {
  return AppDataSource.manager.count(StoragePlan);
};

export const showStoragePlan = async (id: number) => {
  return await AppDataSource.manager.findOne(StoragePlan, {
    where: { id },
  });
};

export const createStoragePlan = async (data, user_id: number) => {
  const date = new Date();
  const month = date.getMonth() > 9 ? date.getMonth() : (`0${date.getMonth()}`)
  const count = await countStoragePlan()
  let number = ''
  for (let i = 0; i < 8- (count+1).toString().length; i++) {
    number+='0'
  }
  data.order_number = `${date.getFullYear()}${month}${date.getDate()}${number}${count+1}`
  data.user_id = user_id
  const repository = await AppDataSource.getRepository(StoragePlan);
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updateStoragePlan = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(StoragePlan);
  const old_data = await repository.findOne({where: {id}})
  if(!old_data) {
    return null
  }
  delete old_data.history;
  const result = await repository.update({ id }, data);
  const history_data = await repository.findOne({where: {id}})
  if(!history_data.history) {
    history_data.history = []
  }
  history_data.history.push({type: 'storage_plan', data: old_data})
  await repository.update({ id }, history_data);

  return result;
};

export const removeStoragePlan = async (id: number) => {
  const repository = await AppDataSource.getRepository(StoragePlan);
  const result = await repository.delete({ id });
  return result;
};
