import { AppDataSource } from "../config/ormconfig";
import { validateContext } from "../helpers/validate";
import { StaffState } from "../models/staff_state.model";

export const listStaffState = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(StaffState, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: "ASC",
    },
  });
};

export const countStaffState = async () => {
  return AppDataSource.manager.count(StaffState);
};

export const showStaffState = async (id: number) => {
  return await AppDataSource.manager.findOne(StaffState, {
    where: { id },
  });
};

export const createStaffState = async (staff_state_data) => {
  const repository = await AppDataSource.getRepository(StaffState);
  const user_state = repository.create(staff_state_data);
  return await validateContext(AppDataSource, user_state);
};

export const updateStaffState = async (id: number, staff_state_data) => {
  const repository = await AppDataSource.getRepository(StaffState);
  const result = await repository.update({ id }, staff_state_data);
  return result;
};

export const removeStaffState = async (id: number) => {
  const repository = await AppDataSource.getRepository(StaffState);
  const result = await repository.delete({ id });
  return result;
};
