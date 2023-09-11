import { AppDataSource } from '../config/ormconfig';
import { Staff } from '../models/staff.model';
import { Warehouse } from '../models/warehouse.model';
import bcrypt from 'bcryptjs';
import { ILike, In, Not } from 'typeorm';
import { validate } from 'class-validator';
import { StaffState } from '../models/staff_state.model';
import { Role } from '../models/role.model';
import { Organization } from '../models/organization.model';
import { StaffWarehouse } from '../models/staff_warehouse.model';
import { object_state_user } from '../helpers/states';

export const listStaff = async (
  current_page: number,
  number_of_rows: number,
  query: string
) => {
  const skip = (current_page - 1) * number_of_rows | 0;
  const take = number_of_rows | 10;
  const not_deleted = Not("deleted");

  const users = await AppDataSource.manager.find(Staff, {
    take: take,
    skip: skip,
    where: [
      { english_name: ILike(`%${query}%`), state: not_deleted },
      { chinesse_name: ILike(`%${query}%`), state: not_deleted },
    ],
    order: {
      id: 'DESC',
    },
    // relations: ['states', 'roles', 'organizations', 'warehouses'],
  });
  const roles = await AppDataSource.manager.find(Role);
  const organizations = await AppDataSource.manager.find(Organization);
  const warehouse = await AppDataSource.manager.find(Warehouse);
  const mod_staff = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    delete user.password;
    let state = null;
    if (user.state) {
      state = object_state_user(user.state);
    }
    let role = null;
    if (user.role_id) {
      role = roles.find((el) => el.id === user.role_id);
    }
    let organization = null;
    if (user.organization_id) {
      organization = organizations.find((el) => el.id === user.organization_id);
    }
    const ref = await AppDataSource.getRepository(StaffWarehouse);
    const warehouse_ids = await ref.find({ where: { staff_id: user.id } });
    const warehouses = [];
    for (let j = 0; j < warehouse_ids.length; j++) {
      const element = warehouse_ids[j];
      warehouses.push(warehouse.find((el) => el.id === element.warehouse_id));
    }
    mod_staff.push({
      ...user,
      state,
      role,
      organization,
      ...{ warehouses: warehouses.filter((el) => el) },
    });
  }

  return mod_staff;
};

export const countStaff = async () => {
  return AppDataSource.manager.count(Staff);
};

export const showStaff = async (id: number) => {
  const user = await AppDataSource.manager.findOne(Staff, {
    where: { id },
    // relations: ['states', 'roles', 'organizations', 'warehouses'],
  });
  let state = null;
  if (user.state) {
    state = object_state_user(user.state);
  }
  let role = null;
  if (user.role_id) {
    role = await AppDataSource.manager.find(Role, {
      where: { id: user.role_id },
    });
  }
  let organization = null;
  if (user.organization_id) {
    organization = await AppDataSource.manager.find(Organization, {
      where: { id: user.organization_id },
    });
  }
  const warehouse = await AppDataSource.manager.find(Warehouse);
  const ref = await AppDataSource.getRepository(StaffWarehouse);
  const warehouse_ids = await ref.find({ where: { staff_id: user.id } });
  const warehouses = [];
  for (let j = 0; j < warehouse_ids.length; j++) {
    const element = warehouse_ids[j];
    warehouses.push(warehouse.find((el) => el.id === element.warehouse_id));
  }
  delete user.password;
  return {
    ...user,
    state,
    role,
    organization,
    ...{ warehouses: warehouses.filter((el) => el) },
  };
};

export const createStaff = async (user_data) => {
  const repository = await AppDataSource.getRepository(Staff);
  const username_count = await repository.count({
    where: { username: user_data.username },
  });
  if (username_count > 0) {
    return { message: 'username already exists' };
  }
  if (user_data.email) {
    const email_count = await repository.count({
      where: { email: user_data.email },
    });
    if (email_count > 0) {
      return { message: 'email already exists' };
    }
  }
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
    const saved = await AppDataSource.manager.save(user);
    if (user_data.affiliations) {
      const ref = await AppDataSource.getRepository(StaffWarehouse);
      const data = user_data.affiliations.map((el) => {
        return {
          // @ts-ignore
          staff_id: saved.id,
          warehouse_id: el,
        };
      });
      const relations = await ref.create(data);
      await AppDataSource.manager.save(relations);
    }
    // @ts-ignore
    delete user.password;
    return user;
  }
};

export const updateStaff = async (id: number, user_data) => {
  const repository = await AppDataSource.getRepository(Staff);
  if (user_data.password) {
    delete user_data.password;
  }
  if (user_data.affiliations) {
    const ref = await AppDataSource.getRepository(StaffWarehouse);
    await ref.delete({ staff_id: id });
    const data = user_data.affiliations.map((el) => {
      return {
        staff_id: id,
        warehouse_id: el,
      };
    });
    const relations = await ref.create(data);
    await AppDataSource.manager.save(relations);
    delete user_data.affiliations;
  }
  if (user_data) {
    const result = await repository.update({ id }, user_data);
    return result;
  }
  return null;
};

export const removeStaff = async (id: number) => {
  const repository = await AppDataSource.getRepository(Staff);
  //const result = await repository.delete({ id });
  const staff = await repository.update(
    { id },
    {
      state: 'deleted',
    }
  );
  return staff;
};
