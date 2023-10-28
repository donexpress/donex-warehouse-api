import { Request, Response } from 'express';
import { removeFile } from '../context/file';
import { upload } from '../helpers/file';
import { getEntries, xslx } from '../helpers/xlsx';
import { createParamsManifest, getValues } from '../helpers';
import {
  createManifest,
  findManifest,
  countManifest,
  findByTrackingAndCarrier,
  updateManifest,
} from '../context/manifest';
import carriers_type from '../config/carriers';
import { Manifest } from '../models/manifest.model';

export const create = async (req: Request, res: Response) => {
  try {
    await parseHeader(req, res);
    await upload(
      req,
      async (urls: any) => {
        if (urls === null) {
          return res.status(422).json(urls);
        } else {
          const carrier = String(req.query.carrier);
          var worksheetsBody = await xslx(urls.url);
          const data_process = await action_do(
            'create',
            worksheetsBody,
            carrier
          );

          await removeFile(urls.name);
          if (data_process.manifests.length === worksheetsBody.data.length) {
            const count = await countManifest(
              data_process.manifests[0].waybill_id,
              carrier
            );
            const body = {
              count,
              waybill_id: data_process.manifests[0].waybill_id,
            };
            return res.json(body);
          } else {
            return res.status(402).send(data_process.errors);
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

export const update_client = async (req: Request, res: Response) => {
  try {
    await parseHeader(req, res);
    await upload(
      req,
      async (urls: any) => {
        if (urls === null) {
          return res.status(422).json(urls);
        } else {
          const carrier = String(req.query.carrier);
          var worksheetsBody = await xslx(urls.url);
          const data_process = await action_do(
            'update_client',
            worksheetsBody,
            carrier
          );

          await removeFile(urls.name);
          if (data_process.manifests.length === worksheetsBody.data.length) {
            const count = data_process.manifests.length;
            const body = {
              count,
            };
            return res.json(body);
          } else {
            return res.status(402).send(data_process.errors);
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

export const action_do = async (action, worksheetsBody, carrier) => {
  let errors = [];
  let manifests = [];
  for (let i = 0; i < worksheetsBody.data.length; i++) {
    const value = await getValues(worksheetsBody.data[i]);

    if (action === 'create') {
      const manifest_obj = await createParamsManifest(value, carrier);

      const manifest = await createManifest(
        manifest_obj.manifest_data,
        manifest_obj.shipper_data,
        manifest_obj.consignee_data
      );

      if (manifest instanceof Manifest) {
        manifests.push(manifest);
      } else {
        errors.push(manifest);
      }
    } else if (action === 'update_client') {
      const tracking_number = value[0];
      const shipping_cost = value[1];
      const manifest = await findByTrackingAndCarrier(tracking_number, carrier);

      if (manifest.shipping_cost === 0) {
        const update_manifest = await updateManifest(manifest, {
          shipping_cost: shipping_cost,
        });

        if (update_manifest instanceof Manifest) {
          manifests.push(update_manifest);
        } else {
          errors.push(update_manifest);
        }
      }
    }
  }

  return { manifests, errors };
};

export const find = async (req: Request, res: Response) => {
  const waybill = String(req.query.waybill_id);
  const carrier = String(req.query.carrier);
  const current_page = req.query.current_page
    ? Number(req.query.current_page)
    : 1;
  const number_of_rows = req.query.number_of_rows
    ? Number(req.query.number_of_rows)
    : await countManifest(waybill, carrier);
  const params = req.query;
  const manifest = await findManifest(current_page, number_of_rows, params);
  return res.json(manifest);
};

export const listCarriers = (req: Request, res: Response) => {
  res.send({ carriers: getEntries(carriers_type.carriers) });
};

export const parseHeader = (req: Request, res: Response) => {
  const carrier = String(req.query.carrier);
  if (carrier === undefined || carrier === '') {
    return res.status(422).send('the carrier is not empty');
  }
  const contentLength = parseInt(req.headers['content-length'], 10);
  if (contentLength >= 5 * 1024 * 1024) {
    return res.status(413).send('Upload exceeds max size.');
  }
};
