import { Request, Response } from 'express';
import { removeFile } from '../context/file';
import { upload } from '../helpers/file';
import { getEntries, xslx } from '../helpers/xlsx';
import { manifestParams, getValues } from '../helpers';
import {
  createManifest,
  findManifest,
  countManifest,
  findByTrackingAndCarrier,
  updateManifest,
  findByTracking,
} from '../context/manifest';
import carriers_type from '../config/carriers';
import { Manifest } from '../models/manifest.model';

export const create = async (req: Request, res: Response) => {
  return await create_do(req, res, 'create');
};
export const update_customer_do = async (req: Request, res: Response) => {
  return await create_do(req, res, 'update_customer');
};
export const update_supplier_do = async (req: Request, res: Response) => {
  return await create_do(req, res, 'update_supplier');
};

export const create_do = async (
  req: Request,
  res: Response,
  action: string
) => {
  try {
    await parseHeader(req, res);
    await upload(
      req,
      async (urls: any) => {
        if (urls === null) {
          return res.status(422).json(urls);
        } else {
          let errors = [];
          let manifests = [];
          let manifest_paid = [];
          const carrier = String(req.query.carrier);
          var worksheetsBody = await xslx(urls.url);
          for (let i = 0; i < worksheetsBody.data.length; i++) {
            const value = await getValues(worksheetsBody.data[i]);
            await removeFile(urls.name);

            if (action === 'create') {
              const manifest_obj = await manifestParams(value, carrier);

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
            } else if (action === 'update_customer') {
              const tracking_number = value[1];
              const shipping_cost = value[2];
              const manifest = await findByTracking(tracking_number);
              const update_manifest = await updateManifest(manifest, {
                shipping_cost: shipping_cost,
              });
              if (update_manifest instanceof Manifest) {
                manifests.push(update_manifest);
              } else {
                errors.push(update_manifest);
              }
            } else if (action === 'update_supplier') {
              const tracking_number = value[0];
              const sale_price = value[3];
              const invoice_weight = value[1];
              const manifest = await findByTracking(tracking_number);
              if (manifest instanceof Manifest) {
                if (manifest.paid) {
                  manifest_paid.push(manifest);
                } else {
                  const update_manifest = await updateManifest(manifest, {
                    sale_price: sale_price,
                    invoice_weight: invoice_weight,
                    paid: true,
                  });
                  if (update_manifest instanceof Manifest) {
                    manifests.push(update_manifest);
                  } else {
                    errors.push(update_manifest);
                  }
                }
              }
            }
          }

          let body = {};
          body = {
            manifest_count: manifests.length,
            waybill_id:
              action === 'update_supplier' ? null : manifests[0].waybill_id,
            errors: errors,
            manifest_paid_count: manifest_paid.length,
            manifest_paid,
          };

          return res.json(body);
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
      const manifest_obj = await manifestParams(value, carrier);

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
