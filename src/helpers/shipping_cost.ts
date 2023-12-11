export const calculate_cost = async (weight, carrier) => {
  let fee;
  switch (carrier) {
    case 'JT':
      if (weight > 0 && weight <= 0.5) {
        fee = 2.1;
      }

      if (weight >= 0.501 && weight <= 1.0) {
        fee = 2.3;
      }

      if (weight >= 1.001 && weight <= 2.0) {
        fee = 2.5;
      }

      if (weight >= 2.001 && weight < 3.0) {
        fee = 3;
      }
      break;

    case 'Redpack':
      if (weight > 0 && weight <= 1.0) {
        fee = 2.05;
      }

      if (weight > 1.001 && weight <= 3.0) {
        fee = 2.15;
      }

      if (weight > 3.001 && weight <= 5.0) {
        fee = 2.5;
      }

      if (weight > 5.001 && weight <= 30.0) {
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
