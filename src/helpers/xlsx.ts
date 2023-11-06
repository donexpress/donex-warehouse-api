import axios from 'axios';
import { Request } from 'express';
import XLSX from 'xlsx';
import Busboy from 'busboy';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { randomStr } from '.';

export const xslx = async (url: string) => {
  let axiosResponse = await axios.get(url, { responseType: 'arraybuffer' });
  const workbook = XLSX.read(axiosResponse.data);

  let worksheets = workbook.SheetNames.map((sheetName) => {
    return {
      sheetName,
      data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
    };
  });

  return worksheets[0];
};

export const getEntries = (states) => {
  const states_array = [];
  for (const [key, value] of Object.entries(states)) {
    states_array.push(value);
  }
  return states_array;
};

export const jsonToExcel = async (manifest) => {
  const excelHeader = [
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
  const worksheet = XLSX.utils.json_to_sheet(manifest);
  const workbook = XLSX.utils.book_new();
  const millis = Date.now();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'manifest');
  XLSX.utils.sheet_add_aoa(worksheet, [excelHeader], { origin: 'A1' });

  let wscols = [];
  excelHeader.map((arr) => {
    wscols.push({ wch: arr.length + 5 });
  });
  worksheet['!cols'] = wscols;

  let filepath = `src/upload/manifest_${Math.floor(millis / 1000)}.xlsx`;

  XLSX.writeFile(workbook, filepath, {
    compression: true,
  });

  return filepath;
};
