import { AppDataSource } from "../config/ormconfig";
import { Staff } from "../models/staff.model";
import { Warehouse } from "../models/warehouse.model";
import bcrypt from "bcryptjs";
import { In } from "typeorm";
import { validate } from "class-validator";

export const listStaff = async (
  current_page: number,
  number_of_rows: number
) => {
  const users = await AppDataSource.manager.find(Staff, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    order: {
      id: "ASC",
    },
    relations: ["states", "roles", "organizations", "warehouses"],
  });
  console.log(users);
  users.map((user) => delete user.password);
  return users;
};

export const countStaff = async () => {
  return AppDataSource.manager.count(Staff);
};

export const showStaff = async (id: number) => {
  const user = await AppDataSource.manager.findOne(Staff, {
    where: { id },
    relations: ["states", "roles", "organizations"],
  });
  delete user.password;
  return user;
};

export const createStaff = async (user_data) => {
  const repository = await AppDataSource.getRepository(Staff);
  const user_obj = user_data;
  const warehouse_repository = await AppDataSource.getRepository(Warehouse);
  const warehouse_ref = await warehouse_repository.find({
    where: { id: In(user_obj.affiliations) },
  });
  user_obj.affiliations = warehouse_ref;
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

export const updateStaff = async (id: number, user_data) => {
  const repository = await AppDataSource.getRepository(Staff);
  const result = await repository.update({ id }, user_data);
  return result;
};

export const removeStaff = async (id: number) => {
  const repository = await AppDataSource.getRepository(Staff);
  const result = await repository.delete({ id });
  return result;
};
