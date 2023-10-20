import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Manifest } from '../models/manifest';

export const findByTracking = async (
  current_page: number,
  number_of_rows: number,
  tracking: string
) => {
  return AppDataSource.manager.find(Manifest, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: { tracking_number: tracking },
    order: {
      created_at: 'DESC',
    },
    relations: ['sender_addreses', 'receiver_addreses'],
  });
};

export const count = async () => {
  return AppDataSource.manager.count(Manifest);
};

export const findOne = async (id: number) => {
  return await AppDataSource.manager.findOne(Manifest, {
    where: { id },
  });
};

export const create = async (manifest_data) => {
  const repository = await AppDataSource.getRepository(Manifest);
  const manifest = repository.create(manifest_data);
  return await validateContext(AppDataSource, manifest);
};
