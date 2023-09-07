import states from '../config/states';

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
