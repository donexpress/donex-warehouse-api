export const calculate_cost = async (weight, carrier) => {
  let fee;
  switch (carrier) {
    case 'JT':
      if (weight > 0 && weight <= 0.5) {
        fee = 2.1;
      }

      if (weight > 0.501 && weight <= 1000) {
        fee = 2.3;
      }

      if (weight > 1001 && weight <= 2000) {
        fee = 2.5;
      }
      break;

    case 'Redpack':
      if (weight > 0 && weight <= 1000) {
        fee = 2.05;
      }

      if (weight > 1001 && weight <= 3000) {
        fee = 2.15;
      }

      if (weight > 3001 && weight <= 5000) {
        fee = 2.5;
      }

      if (weight > 5001 && weight <= 30000) {
        fee = 3.0;
      }
      break;

    case 'SCM':
      if (weight > 0 && weight <= 0.5) {
        fee = 1.75;
      }
      break;

    default:
      'not fee yet';
      break;
  }

  return fee;
};
