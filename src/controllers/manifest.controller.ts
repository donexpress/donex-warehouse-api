import { Request, Response } from 'express';
import { removeFile } from '../context/file';
import { upload } from '../helpers/file';
import { getEntries, xslx } from '../helpers/xlsx';
import { getValues } from '../helpers';
import {
  createManifest,
  createConsigneeAddress,
  createShipperAddress,
  findByWaybillId,
  findManifest,
  countManifest,
} from '../context/manifest';
import carriers_type from '../config/carriers';
import { Manifest } from '../models/manifest.model';

export const create = async (req: Request, res: Response) => {
  try {
    /* const contentLength = parseInt(req.headers['content-length'], 10);
  if (contentLength >= 5 * 1024 * 1024) {
    res.status(413).send('Upload exceeds max size');
  }
  await upload(
    req,
    (urls: any) => {
      if (urls === null) {
        return res.status(422).json(urls);
      } else {
        console.log(urls);
        return res.json(urls.url);
      }
    },
    true
  ); */

    const url = req.body.url;
    const carrier = req.query.carrier;
    var worksheetsBody = await xslx(url);
    for (let i = 0; i < worksheetsBody.data.length; i++) {
      const value = await getValues(worksheetsBody.data[i]);

      if (carrier === undefined) {
        return res.status(422).send('the carrier is not empty');
      }

      let manifest_data = {
        waybill_id: value[0],
        bag_code: value[1],
        bag_id: value[2],
        tracking_number: value[3],
        client_reference: value[4],
        weigth: value[19],
        unit_weigth: value[20],
        total_declare: value[21],
        sale_price: value[21],
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

      await createManifest(manifest_data, shipper_data, consignee_data);
    }

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const find = async (req: Request, res: Response) => {
  const waybill = String(req.query.waybill_id);
  const current_page = req.query.current_page
    ? Number(req.query.current_page)
    : 1;
  const number_of_rows = req.query.number_of_rows
    ? Number(req.query.number_of_rows)
    : await countManifest(waybill);
  const manifest = await findManifest(current_page, number_of_rows, waybill);
  return res.json(manifest);
};

export const listCarriers = (req: Request, res: Response) => {
  res.send({ carriers: getEntries(carriers_type.carriers) });
};
