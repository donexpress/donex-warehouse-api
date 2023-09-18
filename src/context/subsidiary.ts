import { AppDataSource } from '../config/ormconfig';
import states from '../config/states';
import { validateContext } from '../helpers/validate';
import { Subsidiary } from '../models/subsidiary.model';

export const listSubsidiary = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(Subsidiary, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: 'DESC',
    },
  });
};

export const countSubsidiary = async () => {
  return AppDataSource.manager.count(Subsidiary);
};

export const showSubsidiary = async (id: number) => {
  return await AppDataSource.manager.findOne(Subsidiary, {
    where: { id },
  });
};

export const createSubsidiary = async (subsidiary_data) => {
  const repository = await AppDataSource.getRepository(Subsidiary);
  const role = repository.create(subsidiary_data);
  return await validateContext(AppDataSource, role);
};

export const updateSubsidiary = async (id: number, subsidiary_data) => {
  const repository = await AppDataSource.getRepository(Subsidiary);
  const result = await repository.update({ id }, subsidiary_data);
  return result;
};

export const removeSubsidiary = async (id: number) => {
  const repository = await AppDataSource.getRepository(Subsidiary);
  const result = await repository.delete({ id });
  return result;
};

export const getSubsidiaryStates = () => {
  const dest = [];
  for (const [key, value] of Object.entries(states.regional_division)) {
    dest.push(value);
  }
  return dest;
};
