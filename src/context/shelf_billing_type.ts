import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { ShelfBillingType } from '../models/shelf_billing_type.model';

export const listShelfBillingType = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(ShelfBillingType, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: 'ASC',
    },
  });
};

export const countShelfBillingType = async () => {
  return AppDataSource.manager.count(ShelfBillingType);
};

export const showShelfBillingType = async (id: number) => {
  return await AppDataSource.manager.findOne(ShelfBillingType, {
    where: { id },
  });
};

export const createShelfBillingType = async (data) => {
  const repository = await AppDataSource.getRepository(ShelfBillingType);
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updateShelfBillingType = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(ShelfBillingType);
  const result = await repository.update({ id }, data);
  return result;
};

export const removeShelfBillingType = async (id: number) => {
  const repository = await AppDataSource.getRepository(ShelfBillingType);
  const result = await repository.delete({ id });
  return result;
};
