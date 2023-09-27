import * as path from 'path';
import Excel from 'exceljs';

const getCellValue = (row: Excel.Row, cellIndex: number) => {
  const cell = row.getCell(cellIndex);

  return cell.value ? cell.value.toString() : '';
};
