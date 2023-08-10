import { AppDataSource } from "../config/ormconfig";
import { validateContext } from "../helpers/validate";
import { Departament } from "../models/departament.model";

export const listDepataments = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(Departament, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: "ASC",
    },
  });
};

export const countDepataments = async () => {
  return AppDataSource.manager.count(Departament);
};

export const showDepataments = async (id: number) => {
  return await AppDataSource.manager.findOne(Departament, {
    where: { id },
  });
};

export const createDepataments = async (departament_data) => {
  const repository = await AppDataSource.getRepository(Departament);
  const departament = repository.create(departament_data);
  return await validateContext(AppDataSource, departament);
};

export const updateDepataments = async (id: number, departament_data) => {
  const repository = await AppDataSource.getRepository(Departament);
  const result = await repository.update({ id }, departament_data);
  return result;
};

export const removeDepataments = async (id: number) => {
  const repository = await AppDataSource.getRepository(Departament);
  const result = await repository.delete({ id });
  return result;
};
