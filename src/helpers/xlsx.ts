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
