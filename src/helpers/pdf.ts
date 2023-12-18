const PDFDocument = require('pdfkit');
import { Response } from 'express';
import { OutputPlan } from '../models/output_plan.model';
import { PackingList } from '../models/packing_list.model';
import { ShelfPackages } from '../models/shelf_package.model';

export const jsonToPDF = (
  output_plans: any[],
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
  columns: { key: string; value: string }[],
  header: string | null = null,
  margin_top: number | null = null
) => {
  if (header) {
    myDoc
      .fontSize(14)
      .text(header, 10, 70 + (margin_top ? margin_top : 0))
      .fontSize(8);
  }
  const cell_width = width / columns.length;
  columns.forEach((column, index) => {
    myDoc
      .rect(
        10 + index * cell_width,
        70 + (header ? 15 : 0) + (margin_top ? margin_top : 0),
        cell_width,
        20
      )
      .fillAndStroke('#37446b', '#333333')
      .fillColor('#aeb9e1')
      .text(
        column.value,
        10 + index * cell_width,
        76 + (header ? 15 : 0) + (margin_top ? margin_top : 0),
        {
          width: cell_width,
          align: 'center',
        }
      )
      //reset color text
      .fillColor('#333333');
  });
};

interface Config {
  margin_top?: number
  cell_height?: number
  rows?: number
}
const table_body = (
  myDoc,
  width,
  columns: { key: string; value: string }[],
  table_data: any[],
  config?: Config
) => {
  const cell_width = width / columns.length;
  let count = 0;
  table_data.forEach((row) => {
    columns.forEach((column, column_index) => {
      myDoc
        .rect(
          10 + column_index * cell_width,
          70 +
            count * (config.cell_height ? config.cell_height : (columns.length > 7 ? 25 : 20)) +
            20 +
            (config.margin_top ? config.margin_top : 0),
          cell_width,
          (config.cell_height ? config.cell_height : (columns.length > 7 ? 25 : 20))
        )
        .stroke('#333333')
        .text(
          row[column.key],
          10 + column_index * cell_width,
          75 +
            count * (config.cell_height ? config.cell_height : (columns.length > 7 ? 25 : 20)) +
            20 +
            (config.margin_top ? config.margin_top : 0),
          {
            width: cell_width,
            align: 'center',
          }
        );
    });
    count++;
    if(config && config.rows && config.rows <= count) {
      config.rows = 9;
      config.margin_top = 0
      myDoc.addPage({ layout: 'landscape' });
      count = 0
    }else if(!config || !config.rows) {
      if (columns.length > 7 && count === 18) {
        myDoc.addPage({ layout: 'landscape' });
        count = 0;
      } else if (columns.length <= 7 && count === 22) {
        myDoc.addPage({ layout: 'landscape' });
        count = 0;
      }
    }
  });
};

interface PackageLocation {
  box_number: string;
  case_number: string;
  location: string;
  storage_time: string;
  delivered_time: string;
}

interface OutputPlanData {
  output_number: string;
  user: string;
  warehouse: string;
  box_number: number;
  destination: string;
  address: string;
  observations: string;
}

export const generateOutputPlanInventory = async (
  output_plan_data: OutputPlanData,
  boxes: PackageLocation[],
  res: Response
) => {
  const rect_width = 770;
  const title = 'Comprobante del plan de salida';
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
  const op_data_columns: { key: string; value: string }[] = [
    { key: 'output_number', value: 'Número de salida' },
    { key: 'user', value: 'Usuario' },
    { key: 'warehouse', value: 'Almacén' },
    { key: 'box_number', value: 'Número de cajas' },
    { key: 'destination', value: 'Destino' },
    { key: 'address', value: 'Dirección' },
    { key: 'observations', value: 'Observaciones' },
  ];

  const box_columns: { key: string; value: string }[] = [
    { key: 'box_number', value: 'Número de caja' },
    { key: 'case_number', value: 'Número de caja de expansión' },
    { key: 'location', value: 'Ubicación' },
    { key: 'storage_time', value: 'Tiempo de almacenamiento' },
    { key: 'delivered_time', value: 'Tiempo de entrega' },
  ];

  header(myDoc, rect_width, title);
  table_header(myDoc, rect_width, op_data_columns, 'Datos del plan de salida');
  table_body(myDoc, rect_width, op_data_columns, [output_plan_data], {margin_top: 15});
  table_header(
    myDoc,
    rect_width,
    box_columns,
    'Cajas del plan de salida',
    70
  );
  table_body(myDoc, rect_width, box_columns, boxes, {margin_top: 85, cell_height: 50, rows: 7});
  myDoc.end();
};
