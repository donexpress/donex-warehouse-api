import { validate } from "class-validator";

export const validateContext = async (obj, model) => {
  const errors = await validate(model);
  if (errors.length > 0) {
    return errors;
  } else {
    return await obj.manager.save(model);
  }
};
