import { AppDataSource } from '../config/ormconfig';
import { User } from '../models/user.model';
import { Warehouse } from '../models/warehouse.model';
import bcrypt from 'bcryptjs';
import { FindOptionsWhere, ILike, In, IsNull, Not } from 'typeorm';
import { validate } from 'class-validator';
import { Staff } from '../models/staff.model';
import { PaymentMethod } from '../models/payment_method.model';
import { UserLevel } from '../models/user_level.model';
import { object_state_user } from '../helpers/states';

export const listUser = async (
  current_page: number,
  number_of_rows: number,
  query: string,
  state: string = ''
) => {
  const not_deleted = Not('deleted');

  let where: FindOptionsWhere<User> | FindOptionsWhere<User>[] = [
    { username: ILike(`%${query}%`), state: not_deleted },
    { nickname: ILike(`%${query}%`), state: not_deleted },
  ];

  if (state !== '') {
    where = { state };
  }

  const users = await AppDataSource.manager.find(User, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where,
    order: {
      id: 'DESC',
    },
  });
  const staffs = await AppDataSource.manager.find(Staff);
  const payment_methods = await AppDataSource.manager.find(PaymentMethod);
  const user_levels = await AppDataSource.manager.find(UserLevel);
  const warehouses = await AppDataSource.manager.find(Warehouse);
  const users_mod = users.map((user) => {
    delete user.password;
    let user_state = null;
    if (user.state) {
      user_state = object_state_user(user.state);
    }
    let client_service_representatives = null;
    if (user.client_service_representative) {
      client_service_representatives = staffs.find(
        (el) => el.id === user.client_service_representative
      );
      delete client_service_representatives.password;
    }
    let sales_representatives = null;
    if (user.sales_representative) {
      sales_representatives = staffs.find(
        (el) => el.id === user.sales_representative
      );
      delete sales_representatives.password;
    }
    let finantial_representatives = null;
    if (user.finantial_representative) {
      finantial_representatives = staffs.find(
        (el) => el.id === user.finantial_representative
      );
      delete finantial_representatives.password;
    }
    let sale_sources = null;
    if (user.sales_source) {
      sale_sources = staffs.find(
        (el) => el.id === user.finantial_representative
      );
      delete sale_sources.password;
    }
    let payment_method = null;
    if (user.payment_method_id) {
      payment_method = payment_methods.find(
        (el) => el.id === user.payment_method_id
      );
    }

    let user_level = null;
    if (user.user_level_id) {
      user_level = user_levels.find((el) => el.id === user.user_level_id);
    }
    let warehouse = null;
    if (user.warehouse_id) {
      warehouse = warehouses.find((el) => el.id === user.warehouse_id);
    }
    return {
      ...user,
      user_state,
      client_service_representatives,
      sales_representatives,
      finantial_representatives,
      sale_sources,
      payment_method,
      user_level,
      warehouse,
    };
  });
  return users_mod;
};

export const countUser = async () => {
  return await AppDataSource.getRepository(User).count({
    where: { state: Not('deleted') },
  });
};

export const getUserByUsername = async (
  username: string | null
): Promise<User | null> => {
  return await AppDataSource.getRepository(User).findOne({
    where: {
      username,
    },
  });
};

export const showUser = async (id: number) => {
  let user = await AppDataSource.manager.findOne(User, {
    where: { id },
  });
  if (!user) {
    return null;
  }
  delete user.password;
  let user_state = null;
  if (user.state) {
    //user_state = await AppDataSource.manager.findOne(UserState, {
    //where: { id: user.state_id },
    //});
    user_state = object_state_user(user.state);
  }

  let client_service_representatives = null;
  if (user.client_service_representative) {
    client_service_representatives = await AppDataSource.manager.findOne(
      Staff,
      {
        where: { id: user.client_service_representative },
      }
    );
    if (client_service_representatives) {
      delete client_service_representatives.password;
    }
  }

  let finantial_representatives = null;
  if (user.finantial_representative) {
    finantial_representatives = await AppDataSource.manager.findOne(Staff, {
      where: { id: user.finantial_representative },
    });
    if (finantial_representatives) {
      delete finantial_representatives.password;
    }
  }

  let sales_sources = null;
  if (user.sales_source) {
    sales_sources = await AppDataSource.manager.findOne(Staff, {
      where: { id: user.sales_source },
    });
    if (sales_sources) {
      delete sales_sources.password;
    }
  }

  let sales_representatives = null;
  if (user.sales_representative) {
    sales_representatives = await AppDataSource.manager.findOne(Staff, {
      where: { id: user.sales_representative },
    });
    if (sales_representatives) {
      delete sales_representatives.password;
    }
  }

  let payment_method = null;
  if (user.payment_method_id) {
    payment_method = await AppDataSource.manager.findOne(PaymentMethod, {
      where: { id: user.payment_method_id },
    });
  }

  let user_level = null;
  if (user.user_level_id) {
    user_level = await AppDataSource.manager.findOne(UserLevel, {
      where: { id: user.user_level_id },
    });
  }
  return {
    ...user,
    user_state,
    client_service_representatives,
    finantial_representatives,
    sales_sources,
    sales_representatives,
    payment_method,
    user_level,
  };
};

export const createUser = async (user_data) => {
  const repository = await AppDataSource.getRepository(User);
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

  const count_user = await countUser();
  const customer_count =
    count_user >= 10 ? '1000' + (count_user + 1) : '10000' + (count_user + 1);
  const user_obj = { ...user_data, customer_number: customer_count };
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
  if (user_data.password) {
    delete user_data.password;
  }
  const username_count = await repository.count({
    where: { username: user_data.username, id: Not(id) },
  });
  if (username_count > 0) {
    return { message: 'username already exists' };
  }
  if (user_data.email) {
    const email_count = await repository.count({
      where: { email: user_data.email, id: Not(id) },
    });
    if (email_count > 0) {
      return { message: 'email already exists' };
    }
  }
  const result = await repository.update({ id }, user_data);
  return result;
};

export const removeUser = async (id: number) => {
  const repository = await AppDataSource.getRepository(User);
  //const result = await repository.delete({ id });
  const user = await repository.update(
    { id },
    {
      state: 'deleted',
    }
  );
  return user;
};

export const updatePassword = async(id: number, password: string) => {
  const repository = await AppDataSource.getRepository(User);
  const usr_password = bcrypt.hashSync(
    password,
    isNaN(Number(process.env.PASSWORD_SALT))
      ? 10
      : Number(process.env.PASSWORD_SALT)
  );
  const result = await repository.update({ id }, {password: usr_password});
  return result
}