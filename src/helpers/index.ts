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

export const manifestParams = (value, carrier, customer_code) => {
  let manifest_data = {
    waybill_id: value[0],
    bag_code: value[1],
    bag_id: value[2],
    tracking_number: value[3],
    client_reference: customer_code, //value[4]
    weigth: value[19],
    unit_weigth: value[20],
    total_declare: value[21],
    currency: value[22],
    item_title: value[23],
    quantity: value[24],
    pieces: value[24],
    carrier: carrier,
    state: 'pending',
    manifest_name: value[4],
    item_description: '',
    payment_voucher: '',
    bill_state: 'pending',
    sale_price: value[25] === '' ? 0 : value[25],
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

export const removeNullProperties = <T>(obj: T): T => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};
export const calcDate = (date1: string, date2: string) => {
  /*
   * calcDate() : Calculates the difference between two dates
   * @date1 : "First Date in the format MM-DD-YYYY"
   * @date2 : "Second Date in the format MM-DD-YYYY"
   * return : Array
   */

  //new date instance
  const dt_date1 = new Date(date1);
  const dt_date2 = new Date(date2);

  //Get the Timestamp
  const date1_time_stamp = dt_date1.getTime();
  const date2_time_stamp = dt_date2.getTime();

  let calc;

  //Check which timestamp is greater
  if (date1_time_stamp > date2_time_stamp) {
    calc = new Date(date1_time_stamp - date2_time_stamp);
  } else {
    calc = new Date(date2_time_stamp - date1_time_stamp);
  }
  //Retrieve the date, month and year
  const calcFormatTmp =
    calc.getDate() + '-' + (calc.getMonth() + 1) + '-' + calc.getFullYear();
  //Convert to an array and store
  const calcFormat = calcFormatTmp.split('-');
  //Subtract each member of our array from the default date
  const days_passed = Number(Math.abs(Number(calcFormat[0])) - 1);
  const months_passed = Number(Math.abs(Number(calcFormat[1])) - 1);
  const years_passed = Number(Math.abs(Number(calcFormat[2])) - 1970);

  //Set up custom text
  const yrsTxt = ['year', 'years'];
  const mnthsTxt = ['month', 'months'];
  const daysTxt = ['day', 'days'];

  //Convert to days and sum together
  const total_days = years_passed * 365 + months_passed * 30.417 + days_passed;
  const total_secs = total_days * 24 * 60 * 60;
  const total_mins = total_days * 24 * 60;
  const total_hours = total_days * 24;
  const total_weeks = total_days >= 7 ? total_days / 7 : 0;

  //display result with custom text
  const result =
    (years_passed == 1
      ? years_passed + ' ' + yrsTxt[0] + ' '
      : years_passed > 1
      ? years_passed + ' ' + yrsTxt[1] + ' '
      : '') +
    (months_passed == 1
      ? months_passed + ' ' + mnthsTxt[0]
      : months_passed > 1
      ? months_passed + ' ' + mnthsTxt[1] + ' '
      : '') +
    (days_passed == 1
      ? days_passed + ' ' + daysTxt[0]
      : days_passed > 1
      ? days_passed + ' ' + daysTxt[1]
      : '');

  //return the result
  return {
    total_days: Math.round(total_days),
    total_weeks: Math.round(total_weeks),
    total_hours: Math.round(total_hours),
    total_minutes: Math.round(total_mins),
    total_seconds: Math.round(total_secs),
    result: result.trim(),
  };
};

export const colManifest = () => {
  return [
    'MANIFEST ID',
    'MWB',
    'BAG CODE',
    'BAG ID',
    'TRACKING',
    'CLIENT REF. NO',
    'NAME',
    'WEIGTH',
    'UNIT OF',
    'TOTAL DECLARE',
    'CURRENCY',
    'ITEM TITLE',
    'ITEM DESCRIPTION',
    'QUANTITY',
    'PIECES',
    'SHIPPING COST',
    'SALE PRICE',
    'INVOICE WEIGHT',
    'STATE',
    'PAID',
    'PAYMENT VOUCHER',
    'BILL STATE',
    'CARRIER',
    'CREATED AT',
    'UPDATED AT',
  ];
};

export const colPartialManifest = () => {
  return [
    'MWB',
    'tracking_number',
    'invoice_weight',
    'shipping_cost'
  ];
};
