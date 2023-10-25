import { upload } from './file';

export const randomStr = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const splitLastOccurrence = (str, substring) => {
  const lastIndex = str.lastIndexOf(substring);
  const before = str.slice(0, lastIndex);
  const after = str.slice(lastIndex + 1);
  return [before, after];
};

export const getValues = (obj) => {
  const obj_array = [];
  for (const [key, value] of Object.entries(obj)) {
    obj_array.push(value);
  }
  return obj_array;
};

export const getObject = (value, carrier) => {
  let manifest_data = {
    waybill_id: value[0],
    bag_code: value[1],
    bag_id: value[2],
    tracking_number: value[3],
    client_reference: value[4],
    weigth: value[19],
    unit_weigth: value[20],
    total_declare: value[21],
    currency: value[22],
    item_title: value[23],
    quantity: value[24],
    pieces: value[24],
    carrier: carrier,
    state: 'pending',
    manifest_name: '',
    item_description: '',
    payment_voucher: '',
    bill_state: '',
  };

  let shipper_data = {
    name: value[5],
    tax_id: '',
    address: value[6],
    address2: '',
    city: value[7],
    state: value[7],
    city_code: value[8],
    country: value[9],
    country_code: value[10],
    code_zip: '',
    phone_number: '',
    email: '',
  };

  let consignee_data = {
    name: value[11],
    tax_id: '',
    address: value[12],
    address2: '',
    code_zip: value[13],
    city: value[14],
    state: value[14],
    phone_number: value[15],
    city_code: value[16],
    country: value[17],
    country_code: value[18],
    email: '',
  };

  return { manifest_data, shipper_data, consignee_data };
};
