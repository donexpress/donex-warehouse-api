import { Request, Response } from 'express';
import countries from 'countries-list';
import { countUser } from '../context/user';
import { countStaff } from '../context/staff';
import { countRole } from '../context/role';
import { countUserLevel } from '../context/user_level';
import { countPaymentMethods } from '../context/payment_method';
import { countDepataments } from '../context/organization';
import { countWarehouse } from '../context/warehouse';
import { countServices } from '../context/service';
import { countAOSWarehouse } from '../context/aos_warehouse';
import { countStoragePlan } from '../context/storage_plan';
import { countOutputPlan } from '../context/output_plan';
import { countLineClassification } from '../context/line_classification';
import { countRegionalDivision } from '../context/regional_division';
import { getCurrentUser } from '../middlewares';
const Barcode = require('jsbarcode');
import Canvas from 'canvas';
import { AppDataSource } from '../config/ormconfig';
import { StoragePlan } from '../models/storage_plan.model';
import { In } from 'typeorm';
import { User } from '../models/user.model';
const PDFDocument = require('pdfkit');

export const country = async (req: Request, res: Response) => {
  const countryCodes = Object.keys(countries.countries);
  const countryBody = countryCodes.map((code) => countries.countries[code]);
  res.json(countryBody);
};

export const counts = async (req: Request, res: Response) => {
  const user_count = await countUser();
  const staff_count = await countStaff();
  const role_count = await countRole();
  const level_count = await countUserLevel();
  const payment_level_count = await countPaymentMethods();
  const organization_count = await countDepataments();
  const warehouse_count = await countAOSWarehouse();
  const service_count = await countServices();
  const supplier_count = 0;
  const storage_plan_count = await countStoragePlan();
  const output_plan_count = await countOutputPlan();
  const cargo_station_count = await countWarehouse();
  const line_clasification_count = await countLineClassification();
  const regional_division_count = await countRegionalDivision();

  res.json({
    user_count,
    staff_count,
    role_count,
    level_count,
    payment_level_count,
    organization_count,
    warehouse_count,
    service_count,
    supplier_count,
    storage_plan_count,
    output_plan_count,
    cargo_station_count,
    line_clasification_count,
    regional_division_count,
  });
};

export const barcode = async (req: Request, res: Response) => {
  const storage_plans = await AppDataSource.manager.find(StoragePlan, {
    where: { order_number: In(req.body.order_numbers) },
  });
  const users = await AppDataSource.manager.find(User, {
    where: { id: In(storage_plans.map((el) => el.user_id)) },
  });
  const myDoc = new PDFDocument({ bufferPages: true });
  let buffers = [];
  myDoc.on('data', buffers.push.bind(buffers));
  myDoc.on('end', () => {
    let pdfData = Buffer.concat(buffers);
    res
      .writeHead(200, {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment;filename=plan_label.pdf',
      })
      .end(pdfData);
  });
  let spacer: number = 1;
  const rect_height = 235;
  const rect_width = 400;
  const start = 110;
  storage_plans.forEach((storage_plan, index) => {
    const canvas = Canvas.createCanvas(200, 200);
    // if (index % 3 === 0 && index !== 0) {
    //   myDoc.addPage();
    //   spacer = 0;
    // }
    myDoc
      .rect(
        start,
        spacer * rect_height + 15 + spacer * 15,
        rect_width,
        rect_height
      )
      .stroke('#333333')
      .fontSize(25)
      .text(
        users.find((u) => u.id === storage_plan.user_id).username,
        start,
        spacer * rect_height + 25 + spacer * 15,
        {
          width: rect_width,
          align: 'center',
        }
      )
      // Horizontal Line
      .lineCap('butt')
      .moveTo(start, spacer * rect_height + 50 + spacer * 15)
      .lineTo(start + rect_width, spacer * rect_height + 50 + spacer * 15)
      .stroke()
      .lineCap('butt')
      .moveTo(start, spacer * rect_height + 85 + spacer * 15)
      .lineTo(start + rect_width, spacer * rect_height + 85 + spacer * 15)
      .stroke()
      .fontSize(13)
      .text('Order/No', start, spacer * rect_height + 57 + spacer * 15, {
        width: 50,
        align: 'center',
      })
      // Vertical Line
      .lineCap('butt')
      .moveTo(start + 70, spacer * rect_height + 85 + spacer * 15)
      .lineTo(start + 70, spacer * rect_height + 50 + spacer * 15)
      .stroke()
      .text(
        storage_plan.customer_order_number,
        start + 60,
        spacer * rect_height + 63 + spacer * 15,
        {
          width: rect_width - 50,
          align: 'center',
        }
      )
      .lineCap('butt')
      .moveTo(start, spacer * rect_height + 125 + spacer * 15)
      .lineTo(start + rect_width, spacer * rect_height + 125 + spacer * 15)
      .stroke()
      .text('Reference/No', start, spacer * rect_height + 90 + spacer * 15, {
        width: 70,
        align: 'center',
      })
      // Vertical Line
      .lineCap('butt')
      .moveTo(start + 70, spacer * rect_height + 125 + spacer * 15)
      .lineTo(start + 70, spacer * rect_height + 85 + spacer * 15)
      .stroke()
      .text(
        storage_plan.reference_number === ''
          ? '--'
          : storage_plan.reference_number,
        start + 60,
        spacer * rect_height + 100 + spacer * 15,
        {
          width: rect_width - 50,
          align: 'center',
        }
      )
      .lineCap('butt')
      .moveTo(start, spacer * rect_height + 150 + spacer * 15)
      .lineTo(start + rect_width, spacer * rect_height + 150 + spacer * 15)
      .stroke()
      .text(
        `Cajas: ${storage_plan.box_amount}`,
        start,
        spacer * rect_height + 133 + spacer * 15,
        {
          width: rect_width,
          align: 'center',
        }
      );
    Barcode(canvas, storage_plan.order_number, {
      format: 'CODE128',
      displayValue: false,
      fontSize: 18,
      textMargin: 10,
    });

    const barcode_height = 155;
    myDoc
      .image(
        canvas.toBuffer(),
        start + 5,
        spacer * rect_height + barcode_height + spacer * 15,
        {
          width: rect_width - 10,
          height: 80,
          align: 'center',
        }
      )
      .text(
        storage_plan.order_number,
        start,
        spacer * rect_height + barcode_height + 80 + spacer * 15,
        {
          width: rect_width,
          height: 10,
          align: 'center',
        }
      );
    // spacer++; //always the last instrucction
    if (index < storage_plans.length -1) {
      myDoc.addPage();
    }
  });
  myDoc.end();
};
