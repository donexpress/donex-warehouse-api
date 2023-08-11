import { AppDataSource } from "../config/ormconfig";
import { validateContext } from "../helpers/validate";
import { Organization } from "../models/organization.model";

export const listDepataments = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(Organization, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: "ASC",
    },
  });
};

export const countDepataments = async () => {
  return AppDataSource.manager.count(Organization);
};

export const showDepataments = async (id: number) => {
  return await AppDataSource.manager.findOne(Organization, {
    where: { id },
  });
};

export const createDepataments = async (organization_data) => {
  const repository = await AppDataSource.getRepository(Organization);
  const organization = repository.create(organization_data);
  return await validateContext(AppDataSource, organization);
};

export const updateDepataments = async (id: number, organization_data) => {
  const repository = await AppDataSource.getRepository(Organization);
  const result = await repository.update({ id }, organization_data);
  return result;
};

export const removeDepataments = async (id: number) => {
  const repository = await AppDataSource.getRepository(Organization);
  const result = await repository.delete({ id });
  return result;
};
