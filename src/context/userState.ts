import { AppDataSource } from "../config/ormconfig";
import { validateContext } from "../helpers/validate";
import { UserState } from "../models/user_state.model";

export const listUserState = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(UserState, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: "ASC",
    },
  });
};

export const countUserState = async () => {
  return AppDataSource.manager.count(UserState);
};

export const showUserState = async (id: number) => {
  return await AppDataSource.manager.findOne(UserState, {
    where: { id },
  });
};

export const createUserState = async (user_state_data) => {
  const repository = await AppDataSource.getRepository(UserState);
  const role = repository.create(user_state_data);
  return await validateContext(AppDataSource, role);
};

export const updateUserState = async (id: number, user_state_data) => {
  const repository = await AppDataSource.getRepository(UserState);
  const result = await repository.update({ id }, user_state_data);
  return result;
};

export const removeUserState = async (id: number) => {
  const repository = await AppDataSource.getRepository(UserState);
  const result = await repository.delete({ id });
  return result;
};
