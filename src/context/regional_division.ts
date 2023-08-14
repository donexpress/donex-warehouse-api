import { AppDataSource } from "../config/ormconfig";
import { validateContext } from "../helpers/validate";
import { RegionalDivision } from "../models/regionalDivision.model";

export const listRegionalDivision = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(RegionalDivision, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: "ASC",
    },
  });
};

export const countRegionalDivision = async () => {
  return AppDataSource.manager.count(RegionalDivision);
};

export const showRegionalDivision = async (id: number) => {
  return await AppDataSource.manager.findOne(RegionalDivision, {
    where: { id },
  });
};

export const createRegionalDivision = async (regional_division_data) => {
  const repository = await AppDataSource.getRepository(RegionalDivision);
  const role = repository.create(regional_division_data);
  return await validateContext(AppDataSource, role);
};

export const updateRegionalDivision = async (id: number, regional_division_data) => {
  const repository = await AppDataSource.getRepository(RegionalDivision);
  const result = await repository.update({ id }, regional_division_data);
  return result;
};

export const removeRegionalDivision = async (id: number) => {
  const repository = await AppDataSource.getRepository(RegionalDivision);
  const result = await repository.delete({ id });
  return result;
};
