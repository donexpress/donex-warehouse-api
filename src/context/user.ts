import { AppDataSource } from "../config/ormconfig";
import { User } from "../models/user.model";
import { Warehouse } from "../models/warehouse.model";
import bcrypt from "bcryptjs";
import { In } from "typeorm";
import { validate } from "class-validator";

const user_relations = [
  "warehouses",
  "warehouses.states",
  "regional_divisions",
  "subsidiaries",
  "finantial_representatives",
  "finantial_representatives.states",
  "finantial_representatives.organizations",
  "finantial_representatives.warehouses",
  "client_service_representatives",
  "client_service_representatives.states",
  "client_service_representatives.organizations",
  "client_service_representatives.warehouses",
  "sales_representatives",
  "sales_representatives.states",
  "sales_representatives.organizations",
  "sales_representatives.warehouses",
  "sales_sources",
  "sales_sources.states",
  "sales_sources.organizations",
  "sales_sources.warehouses"
]

export const listUser = async (
  current_page: number,
  number_of_rows: number
) => {
  const users = await AppDataSource.manager.find(User, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: "ASC",
    },
    relations: user_relations,
  });
  console.log(users);
  users.map((user) => delete user.password);
  return users;
};

export const countUser = async () => {
  return AppDataSource.manager.count(User);
};

export const showUser = async (id: number) => {
  const user = await AppDataSource.manager.findOne(User, {
    where: { id },
    relations: user_relations,
  });
  delete user.password;
  return user;
};

export const createUser = async (user_data) => {
  const repository = await AppDataSource.getRepository(User);
  const user_obj = user_data;
  user_obj.password = bcrypt.hashSync(
    user_obj.password,
    isNaN(Number(process.env.PASSWORD_SALT))
      ? 10
      : Number(process.env.PASSWORD_SALT)
  );
  const user = await repository.create(user_obj);
  const errors = await validate(user);
  if (errors.length > 0) {
    return errors;
  } else {
    await AppDataSource.manager.save(user);
    // @ts-ignore
    delete user.password;
    return user;
  }
};

export const updateUser = async (id: number, user_data) => {
  const repository = await AppDataSource.getRepository(User);
  const result = await repository.update({ id }, user_data);
  return result;
};

export const removeUser = async (id: number) => {
  const repository = await AppDataSource.getRepository(User);
  const result = await repository.delete({ id });
  return result;
};
