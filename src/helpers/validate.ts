import { validate } from 'class-validator';
import { DataSource } from 'typeorm';

export const validateContext = async (obj: DataSource, model) => {
  const errors = await validate(model);
  if (errors.length > 0) {
    return errors;
  } else {
    return await obj.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(model);
    });
  }
};
