import states from "../config/states";

export const state_value = (value) => {
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