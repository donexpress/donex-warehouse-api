import { validate } from 'class-validator';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';

export const validateContext = async (obj, model) => {
  const errors = await validate(model);
  if (errors.length > 0) {
    return errors;
  } else {
    return await obj.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(model);
    });
  }
};
