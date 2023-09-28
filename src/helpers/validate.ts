import { validate } from 'class-validator';
import { DataSource } from 'typeorm';

export const validateContext = async (obj, model) => {
  const errors = await validate(model);
  if (errors.length > 0) {
    return errors;
  } else {
    await obj.manager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save(model);
    });
  }
};
