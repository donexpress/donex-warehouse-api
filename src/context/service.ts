import { AppDataSource } from "../config/ormconfig";
import { validateContext } from "../helpers/validate";
import { Service } from "../models/service.model";

export const listServices = async (
  current_page: number,
  number_of_rows: number
) => {
  return AppDataSource.manager.find(Service, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: "ASC",
    },
  });
};

export const countServices = async () => {
  return AppDataSource.manager.count(Service);
};

export const showService = async (id: number) => {
  return await AppDataSource.manager.findOne(Service, {
    where: { id },
});
};

export const createService = async (service_data) => {
  const repository = await AppDataSource.getRepository(Service);
  const service = repository.create(service_data);
  return await validateContext(AppDataSource, service);
};

export const updateService = async (id: number, service_data) => {
  const repository = await AppDataSource.getRepository(Service);
  const result = await repository.update({ id }, service_data);
  return result;
};

export const removeService = async (id: number) => {
  const repository = await AppDataSource.getRepository(Service);
  const result = await repository.delete({ id });
  return result;
};
