import { EntityMetadata, FindOptionsWhere, ILike, Repository } from 'typeorm';
import states from '../config/states';
import { OutputPlan } from '../models/output_plan.model';

export const object_state_warehouse = (value) => {
  switch (value) {
    case 'normal':
      return states.warehouse.normal;

    case 'frezze':
      return states.warehouse.frezze;

    case 'close':
      return states.warehouse.close;

    default:
      return false;
  }
};

export const object_state_staff = (value) => {
  switch (value) {
    case 'normal':
      return states.staff.normal;

    case 'frezze':
      return states.staff.frezze;

    case 'resign':
      return states.staff.resign;

    default:
      return false;
  }
};

export const object_state_user = (value) => {
  switch (value) {
    case 'normal':
      return states.user.normal;

    case 'frezze':
      return states.user.frezze;

    case 'pending payment':
      return states.user.pending_payment;

    default:
      return false;
  }
};

export const getStates = (states) => {
  const states_array = [];
  for (const [key, value] of Object.entries(states)) {
    states_array.push(value);
  }
  return states_array;
};

export const getCountByState = async (
  repository,
  state_value,
  current_user,
  query: string = ''
): Promise<number> => {
  let where: any = { state: state_value };
  if (current_user.customer_number) {
    where = [
      {
        customer_order_number: ILike(`%${query}%`),
        state: state_value,
        user_id: current_user.id,
      },
      {
        order_number: ILike(`%${query}%`),
        state: state_value,
        user_id: current_user.id,
      },
      {
        pr_number: ILike(`%${query}%`),
        state: state_value,
        user_id: current_user.id,
      },
      {
        reference_number: ILike(`%${query}%`),
        state: state_value,
        user_id: current_user.id,
      },
    ];
  } else {
    where = [
      { customer_order_number: ILike(`%${query}%`), state: state_value },
      { order_number: ILike(`%${query}%`), state: state_value },
      { pr_number: ILike(`%${query}%`), state: state_value },
      { reference_number: ILike(`%${query}%`), state: state_value },
    ];
  }

  const by_state = await repository.count({
    where,
  });

  return by_state;
};
