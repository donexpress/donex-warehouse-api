import { Request, Response } from 'express';
import { removeFile } from '../context/file';
import { upload } from '../helpers/file';
import { getEntries, xslx } from '../helpers/xlsx';
import { getObject, getValues } from '../helpers';
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
    const carrier = req.query.carrier;
    if (carrier === undefined) {
      return res.status(422).send('the carrier is not empty');
    }
    const contentLength = parseInt(req.headers['content-length'], 10);
    if (contentLength >= 5 * 1024 * 1024) {
      return res.status(413).send('Upload exceeds max size');
    }
    await upload(
      req,
      async (urls: any) => {
        if (urls === null) {
          return res.status(422).json(urls);
        } else {
          const url = urls.url;
          //const url = req.body.url;
          let error = [];
          let manifests = [];
          var worksheetsBody = await xslx(url);
          for (let i = 0; i < worksheetsBody.data.length; i++) {
            const value = await getValues(worksheetsBody.data[i]);

            const manifest_obj = await getObject(value, carrier);

            const manifest = await createManifest(
              manifest_obj.manifest_data,
              manifest_obj.shipper_data,
              manifest_obj.consignee_data
            );

            if (manifest instanceof Manifest) {
              manifests.push(manifest);
            } else {
              error.push(manifest);
            }
          }

          await removeFile(urls.name);
          if (manifests.length === worksheetsBody.data.length) {
            return res.sendStatus(201);
          } else {
            return res.status(402).send(error);
          }
        }
      },
      true
    );
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
