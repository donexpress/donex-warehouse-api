import { Request, Response } from 'express';
import { removeFile, uploadFileToStore } from '../context/file';
import { upload } from '../helpers/file';
import { getEntries, jsonToExcel, xslx } from '../helpers/xlsx';
import {
  manifestParams,
  getValues,
  colManifest,
  colPartialManifest,
} from '../helpers';
import {
  createManifest,
  findManifest,
  countManifest,
  findByTrackingAndCarrier,
  updateManifest,
  findByTracking,
  findByWaybillId,
  removeManifest,
  sumManifest,
  findByWaybillAndCarrier,
  countManifestWaybillAndCarrier,
  selectByWaybill,
  listManifests,
} from '../context/manifest';
import carriers_type from '../config/carriers';
import { Manifest } from '../models/manifest.model';
import fs from 'fs';

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
          let waybill_id = null;
          let manifest_charged = [];
          let tracking_number_charged = [];
          let manifests_bill_code = [];
          const carrier = String(req.query.carrier);
          const mwb = String(req.query.mwb);
          const customer_code = String(req.query.customer_code);
          const force = Boolean(req.query.force) || false;
          const waybills = await findByWaybillAndCarrier(mwb, carrier);
          if (waybills.length > 0 && force !== true) {
            return res.status(205).send('This manifest is already stored');
          }
          var worksheetsBody = await xslx(urls.url);
          await removeFile(urls.name);
          //for (let i = 0; i < worksheetsBody.data.length; i++) {
          //const value = await getValues(worksheetsBody.data[i]);

          if (action === 'create') {
            for (let i = 0; i < worksheetsBody.data.length; i++) {
              const value = await getValues(worksheetsBody.data[i]);
              const manifest_obj = await manifestParams(
                value,
                carrier,
                customer_code
              );

              const manifest = await createManifest(
                manifest_obj.manifest_data,
                manifest_obj.shipper_data,
                manifest_obj.consignee_data
              );

              if (manifest instanceof Manifest) {
                manifests.push(manifest);
                waybill_id = value[0].waybill_id;
              } else {
                errors.push(manifest);
              }
            }
          } else if (action === 'update_customer') {
            for (let i = 0; i < worksheetsBody.data.length; i++) {
              const value = await getValues(worksheetsBody.data[i]);
              const tracking_number = value[1];
              const sale_price = value[2];
              const manifest = await findByTracking(tracking_number);
              const update_manifest = await updateManifest(manifest, {
                sale_price: sale_price,
              });
              if (update_manifest instanceof Manifest) {
                manifests.push(update_manifest);
              } else {
                errors.push(update_manifest);
              }
            }
          } else if (action === 'update_supplier') {
            const bill_code = String(req.query.bill_code);
            for (let i = 0; i < worksheetsBody.data.length; i++) {
              const value = await getValues(worksheetsBody.data[i]);
              const tracking_number = value[0];
              const shipping_cost = value[2];
              const invoice_weight = value[1];
              const manifest = await findByTracking(tracking_number);
              if (manifest instanceof Manifest) {
                if (manifest.bill_state === 'charged') {
                  manifest_charged.push(manifest);
                } else {
                  const update_manifest = await updateManifest(manifest, {
                    shipping_cost: shipping_cost,
                    invoice_weight: invoice_weight,
                    payment_voucher: bill_code,
                    bill_state: 'charged',
                  });
                  if (update_manifest instanceof Manifest) {
                    manifests.push(update_manifest);
                  } else {
                    errors.push(update_manifest);
                  }
                }
              } else {
                const elem = {
                  tracking_number: value[0],
                  invoice_weight: value[1],
                  shipping_cost: value[2],
                };
                tracking_number_charged.push(elem);
              }
            }
            const manifests_code = await listManifests(bill_code);
            if (manifests_code.length > 0) {
              const excelHeader = await colPartialManifest();
              const filepath = await jsonToExcel(manifests_code, excelHeader);

              const urls = await uploadFileToStore(filepath, 'xlsx', bill_code);

              manifests_bill_code.push(urls);
              fs.unlink(filepath, () => {});
            } else {
              errors.push(manifests_code);
            }
          }
          //}

          let body = {};
          body = {
            manifest_count: manifests.length,
            manifest_charged_count: manifest_charged.length,
            waybill_id: action === 'update_supplier' ? null : waybill_id,
            manifest_charged,
            tracking_number_charged:
              action === 'update_supplier' ? tracking_number_charged : [],
            manifests_bill_code: manifests_bill_code,
            errors: errors,
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

export const find = async (req: Request, res: Response) => {
  const params = req.query;
  const current_page = req.query.current_page
    ? Number(req.query.current_page)
    : 1;
  const number_of_rows = req.query.number_of_rows
    ? Number(req.query.number_of_rows)
    : await countManifest(params);
  const manifest = await findManifest(current_page, number_of_rows, params);
  return res.json(manifest);
};

export const jsonToxlsx = async (req: Request, res: Response) => {
  const waybill_id = req.query.waybill_id;
  const carrier = req.query.carrier;
  let manifest = null;

  if (carrier === undefined) {
    manifest = await findByWaybillId(String(waybill_id));
  } else {
    manifest = await findByWaybillAndCarrier(
      String(waybill_id),
      String(carrier)
    );
  }

  if (manifest !== null) {
    const excelHeader = await colManifest();
    const filepath = await jsonToExcel(manifest, excelHeader);

    const urls = await uploadFileToStore(filepath, 'xlsx');

    res.json(urls);
    fs.unlink(filepath, () => {});
  } else {
    return res.sendStatus(404);
  }
};

export const sum = async (req: Request, res: Response) => {
  const waybill_id = req.query.waybill_id;
  const carrier = req.query.carrier;

  const sum = await sumManifest(waybill_id, carrier);

  return res.json(sum);
};

export const listCarriers = (req: Request, res: Response) => {
  res.send({ carriers: getEntries(carriers_type.carriers) });
};

export const count = async (req: Request, res: Response) => {
  const count = await countManifest(req.query === undefined ? '' : req.query);
  res.json({ count });
};

export const byWaybill = async (req: Request, res: Response) => {
  const waybill = await selectByWaybill();
  res.json(waybill);
};

export const supplier_invoice = async (req: Request, res: Response) => {
  const bill_code = String(req.query.bill_code);
  const waybills = await listManifests(String(bill_code));
  const excelHeader = await colPartialManifest();
  const filepath = await jsonToExcel(waybills, excelHeader);

  const urls = await uploadFileToStore(filepath, 'xlsx', bill_code);
  res.json(urls);
  fs.unlink(filepath, () => {});
};

const parseHeader = (req: Request, res: Response) => {
  const carrier = String(req.query.carrier);
  if (carrier === undefined || carrier === '') {
    return res.status(422).send('the carrier is not empty');
  }
  const contentLength = parseInt(req.headers['content-length'], 10);
  if (contentLength >= 5 * 1024 * 1024) {
    return res.status(413).send('Upload exceeds max size.');
  }
};

export const remove = async (req: Request, res: Response) => {
  const waybill_id = req.query.waybill_id;
  const manifest = await findByWaybillId(String(waybill_id));
  await removeManifest(manifest);

  res.sendStatus(200);
};
