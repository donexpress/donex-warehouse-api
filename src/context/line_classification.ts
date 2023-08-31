import { ILike } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { LineClassification } from '../models/line_clasification.model';

export const listLineClassification = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  return AppDataSource.manager.find(LineClassification, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: [{ name: ILike(`%${query}%`) }],
    order: {
      id: 'ASC',
    },
  });
};

export const countLineClassification = async () => {
  return AppDataSource.manager.count(LineClassification);
};

export const showLineClassification = async (id: number) => {
  return await AppDataSource.manager.findOne(LineClassification, {
    where: { id },
  });
};

export const createLineClassification = async (data: any) => {
  const repository = await AppDataSource.getRepository(LineClassification);
  const result = repository.create(data);
  return await validateContext(AppDataSource, result);
};

export const updateLineClassification = async (id: number, data) => {
  const repository = await AppDataSource.getRepository(LineClassification);
  data.updated_at =  new Date().toDateString()
  const result = await repository.update({ id }, data);
  return result;
};

export const removeLineClassification = async (id: number) => {
  const repository = await AppDataSource.getRepository(LineClassification);
  const result = await repository.delete({ id });
  return result;
};
