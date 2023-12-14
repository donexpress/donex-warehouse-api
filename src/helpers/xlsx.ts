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

export const jsonToExcel = async (manifest, excelHeader) => {
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

export const generateBillXlsx = async (
  xlsx_headers,
  xlsx_data,
  address,
  email,
  name,
  awb,
  bill_code
) => {
  // const worksheet = XLSX.utils.json_to_sheet(xlsx_data);
  const worksheet = XLSX.utils.json_to_sheet([]);
  const workbook = XLSX.utils.book_new();
  const millis = Date.now();
  const date = new Date();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'bill');
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      ['','','DON EXPRESS CO., LIMITED.'],
      [],
      ['','','','账 单 明 细 表（派送）'],
      [`地址: ${address} \n 邮箱: ${email}`],
      [],
      [],
      [
        `账单编号: ${bill_code}`
        //`账单编号: ${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2,'0')}${Math.floor(Math.random()*1000)}`
      ],
      [
        `账单日期:`, `${date.toDateString()}` 
      ],
      [
        `客户名称: ${name}`, "", "", "", "", "","",`AWB: ${awb}`
      ],
      xlsx_headers,
    ],
    { origin: 'A1' }
  );
  const alignmentCenter = { horizontal: "center", vertical: "center", wrapText: true };
  worksheet['C1'].s = alignmentCenter
  XLSX.utils.sheet_add_json(worksheet, xlsx_data, {origin: 'A11', skipHeader: true})
  const merge = [
    { s: { r: 0, c: 2 }, e: { r: 0, c: 5 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
    { s: { r: 2, c: 3 }, e: { r: 2, c: 5 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 8 } },
    { s: { r: 4, c: 2 }, e: { r: 4, c: 5 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 8 } },
    { s: { r: 6, c: 0 }, e: { r: 6, c: 2 } },
    { s: { r: 8, c: 0 }, e: { r: 8, c: 2 } },
    { s: { r: 8, c: 7 }, e: { r: 8, c: 8 } },
  ];
  worksheet['!merges'] = merge;

  let wscols = [];
  xlsx_headers.map((arr) => {
    wscols.push({ wch: arr.length + 5 });
  });
  worksheet['!cols'] = wscols;
  let filepath = `src/upload/bill_${Math.floor(millis / 1000)}.xlsx`;

  XLSX.writeFile(workbook, filepath, {
    compression: true,
  });

  return filepath;
};
