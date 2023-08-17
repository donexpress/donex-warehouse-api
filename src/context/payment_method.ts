import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { PaymentMethod } from '../models/payment_method.model';
import { ILike } from 'typeorm';
export const listPaymentMethods = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  return AppDataSource.manager.find(PaymentMethod, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: {
      name: ILike(`%${query}%`),
    },
    order: {
      id: 'ASC',
    },
  });
};

export const countPaymentMethods = async () => {
  return AppDataSource.manager.count(PaymentMethod);
};

export const showPaymentMethod = async (id: number) => {
  return await AppDataSource.manager.findOne(PaymentMethod, {
    where: { id },
  });
};

export const createPaymentMethod = async (payment_method_data) => {
  const repository = await AppDataSource.getRepository(PaymentMethod);
  const payment_method = repository.create(payment_method_data);
  return await validateContext(AppDataSource, payment_method);
};

export const updatePaymentMethod = async (id: number, payment_method_data) => {
  const repository = await AppDataSource.getRepository(PaymentMethod);
  const result = await repository.update({ id }, payment_method_data);
  return result;
};

export const removePaymentMethod = async (id: number) => {
  const repository = await AppDataSource.getRepository(PaymentMethod);
  const result = await repository.delete({ id });
  return result;
};
