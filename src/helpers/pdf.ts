const PDFDocument = require('pdfkit');
import { Response } from 'express';
import { OutputPlan } from '../models/output_plan.model';

export const jsonToPDF = (
  output_plans: OutputPlan[],
  columns: { key: string; value: string }[],
  title: string,
  res: Response
) => {
  const myDoc = new PDFDocument({ bufferPages: true, layout: 'landscape' });
  let buffers = [];
  myDoc.on('data', buffers.push.bind(buffers));
  myDoc.on('end', () => {
    let pdfData = Buffer.concat(buffers);
    res
      .writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment;filename=report.pdf`,
      })
      .end(pdfData);
  });
  const rect_width = 770;
  header(myDoc, rect_width, title);
//   table(myDoc, rect_width, rect_height);
  table_header(myDoc, rect_width, columns);
  table_body(myDoc, rect_width, columns, output_plans);
  myDoc.end();
};

const header = (myDoc, width, title: string) => {
  myDoc.fontSize(20).text(title, 10, 40, {
    width: width,
    align: 'center',
  });
  // reset text height
  myDoc.fontSize(8);
};

const table_header = (
  myDoc,
  width,
  columns: { key: string; value: string }[]
) => {
  const cell_width = width / columns.length;
  columns.forEach((column, index) => {
    myDoc
      .rect(10 + index * cell_width, 70, cell_width, 20)
      .fillAndStroke('#270fd9', '#333333')
      .fillColor('#ffffff')
      .text(column.value, 10 + index * cell_width, 75, {
        width: cell_width,
        align: 'center',
      })
      //reset color text
      .fillColor("#333333");
  });
};
const table_body = (
  myDoc,
  width,
  columns: { key: string; value: string }[],
  table_data: any[]
) => {
  const cell_width = width / columns.length;
  let count  = 0
  table_data.concat(table_data).forEach((row) => {
    columns.forEach((column, column_index) => {
      myDoc
        .rect(10 + column_index * cell_width, 70 + (count * (columns.length > 7 ? 25 : 20)) + 20, cell_width, columns.length > 7 ? 25 : 20)
        .stroke('#333333')
        .text(row[column.key], 10 + column_index * cell_width, 75 + (count * (columns.length > 7 ? 25 : 20)) + 20, {
          width: cell_width,
          align: 'center',
        })
    });
    count ++;
    if(columns.length > 7 && count === 18) {
        myDoc.addPage({layout: 'landscape'});
        count = 0;
    }

    else if(columns.length <= 7 && count === 22) {
        myDoc.addPage({layout: 'landscape'});
        count = 0;
    }
  });
};
