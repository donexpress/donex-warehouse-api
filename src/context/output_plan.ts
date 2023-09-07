import { ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { OutputPlan } from '../models/output_plan.model';
import { User } from '../models/user.model';
import { Warehouse } from '../models/warehouse.model';

export const listOutputPlan = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  const result = await AppDataSource.manager.find(OutputPlan, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [{ output_number: ILike(`%${query}%`) }],
    order: {
      id: 'DESC',
    },
  });
  const users = await AppDataSource.manager.find(User)
  const warehouses = await AppDataSource.manager.find(Warehouse)
  return result.map(el => {
    let user = null
    if(el.user_id) {
      user = users.find(t => t.id === el.user_id)
    }
    let warehouse = null
    if(el.warehouse_id) {
      warehouse = warehouses.find(t => t.id = el.warehouse_id)
    }
    return {...el, user, warehouse}
  })
};

export const countOutputPlan = async () => {
  return AppDataSource.manager.count(OutputPlan);
};

export const showOutputPlan = async (id: number) => {
  const result = await AppDataSource.manager.findOne(OutputPlan, {
    where: { id },
  });
  let user = null
  if(result.user_id) {
    user = await AppDataSource.manager.findOne(User, {where: {id: result.user_id}})
  }
  let warehouse = null
  if(result.warehouse_id) {
    warehouse = await AppDataSource.manager.findOne(Warehouse, {where: {id: result.warehouse_id}})
  }
  return {...result, user, warehouse}
};

export const createOutputPlan = async (data: any) => {
  const repository = await AppDataSource.getRepository(OutputPlan);
  const date = new Date();
  const month = date.getMonth() > 9 ? date.getMonth() : `0${date.getMonth()}`;
  const count = await countOutputPlan();
  let number = '';
  for (let i = 0; i < 6 - (count + 1).toString().length; i++) {
    number += '0';
  }
  data.output_number = `DEWMXO${date.getFullYear()}${month}${date.getDate()}${number}${
    count + 1
  }`;
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updateOutputPlan = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(OutputPlan);
  data.updated_at = new Date().toISOString();
  const result = await repository.update({ id }, data);
  return result;
};

export const removeOutputPlan = async (id: number) => {
  const repository = await AppDataSource.getRepository(OutputPlan);
  const result = await repository.delete({ id });
  return result;
};
