import { ILike, Not } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Appendix } from '../models/appendix.model';
import { showUser } from './user';

export const listAppendix = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  const appendages = await AppDataSource.manager.find(Appendix, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: { name: ILike(`%${query}%`), deleted: false },
    order: {
      id: 'DESC',
    },
  });
  const mod_appendages = [];
  for (let i = 0; i < appendages.length; i++) {
    const appendix = appendages[i];
    mod_appendages.push({ ...appendix, user: await showUser(appendix.id) });
  }
  return mod_appendages;
};

export const countAppendix = async () => {
  return AppDataSource.manager.count(Appendix);
};

export const showAppendix = async (id: number) => {
  const appendix = await AppDataSource.manager.findOne(Appendix, {
    where: { id },
  });
  return { ...appendix, user: await showUser(appendix.id) };
};

export const createAppendix = async (appendix_data: any) => {
  const repository = await AppDataSource.getRepository(Appendix);
  const result = repository.create(appendix_data);
  return await validateContext(AppDataSource, result);
};

export const updateAppendix = async (id: number, appendix_data) => {
  const repository = await AppDataSource.getRepository(Appendix);
  const result = await repository.update({ id }, appendix_data);
  return result;
};

export const removeAppendix = async (id: number) => {
  const repository = await AppDataSource.getRepository(Appendix);
  const result = await repository.update({ id }, {deleted: true});
  return result;
};

export const getAppendagesByOutputPlan = async(id: number) => {
  const appendages = await AppDataSource.manager.find(Appendix, {where: {output_plan_id: id, deleted: false}})
  const mod_appendages = []
  for (let i = 0; i < appendages.length; i++) {
    const appendix = appendages[i];
    const user = await showUser(appendix.id)
    mod_appendages.push({...appendix, user})    
  }
  return mod_appendages
}
