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
  updateManifest,
  findByTracking,
  findByWaybillId,
  removeManifest,
  sumManifest,
  findByWaybillAndCarrier,
  selectByWaybill,
  listManifests,
  paidManifest,
  findManfest,
  paidManifestClient,
  createBill,
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
          let manifest_charged_code = [];
          let unrecorded_manifests = [];
          let manifests_bill_code = [];
          var worksheetsBody = await xslx(urls.url);
          await removeFile(urls.name);
          if (worksheetsBody.data.length < 1) {
            res.status(404).send('No data found to upload');
          }

          if (action === 'create') {
            const carrier = String(req.query.carrier);
            const customer_code = String(req.query.customer_code);
            const mwb = String(req.query.mwb);
            const force = Boolean(req.query.force) || false;
            const waybills = await findByWaybillAndCarrier(mwb, carrier);
            if (waybills.length > 0 && force !== true) {
              return res.status(205).send('This manifest is already stored');
            } else if (waybills.length > 0 && force) {
              for (let i = 0; i < worksheetsBody.data.length; i++) {
                const value = await getValues(worksheetsBody.data[i]);
                const manifest_obj = await manifestParams(
                  value,
                  carrier,
                  customer_code
                );

                const manifest = await findByTracking(
                  manifest_obj.manifest_data.tracking_number
                );

                const manifest_update = await updateManifest(
                  manifest,
                  manifest_obj.manifest_data
                );

                if (manifest_update instanceof Manifest) {
                  manifests.push(manifest_update);
                  waybill_id = manifest.waybill_id;
                } else {
                  errors.push(manifest_update);
                }
              }
            } else {
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
            }
          } else if (action === 'update_customer') {
            for (let i = 0; i < worksheetsBody.data.length; i++) {
              const collected = Boolean(req.query.collected) || false;
              const value = await getValues(worksheetsBody.data[i]);
              const tracking_number = value[1];
              const sale_price = value[2];
              const manifest = await findByTracking(tracking_number);
              const update_manifest = await updateManifest(manifest, {
                sale_price: sale_price,
                state: collected === true ? 'collected' : manifest.state,
              });
              if (update_manifest instanceof Manifest) {
                manifests.push(update_manifest);
              } else {
                errors.push(update_manifest);
              }
            }
          } else if (action === 'update_supplier') {
            const bill_code = String(req.query.bill_code);
            const paid = Boolean(req.query.paid) || false;
            const currency_exchange = Number(req.query.currency_exchange);
            for (let i = 0; i < worksheetsBody.data.length; i++) {
              const value = await getValues(worksheetsBody.data[i]);
              const tracking_number = value[0];
              const shipping_cost = value[2];
              const invoice_weight = value[1];
              const manifest = await findByTracking(tracking_number);
              if (manifest instanceof Manifest) {
                if (manifest.bill_state === 'charged') {
                  const elem = {
                    manifests_waybill_id: manifest.waybill_id + ' (_REPEATED)',
                    manifests_tracking_number: manifest.tracking_number,
                    manifests_invoice_weight: manifest.weigth,
                    manifests_shipping_cost: manifest.shipping_cost,
                    manifests_payment_voucher: manifest.payment_voucher,
                  };
                  manifest_charged_code.push(elem);
                } else {
                  const exchange = shipping_cost / currency_exchange;
                  const update_manifest = await updateManifest(manifest, {
                    shipping_cost: Number(exchange.toFixed(2)),
                    invoice_weight: invoice_weight,
                    payment_voucher: bill_code,
                    bill_state: 'charged',
                    paid: paid, // Only if the client indicates that the data is paid
                  });
                  if (update_manifest instanceof Manifest) {
                    manifests.push(update_manifest);
                  } else {
                    errors.push(update_manifest);
                  }
                }
              } else {
                const elem = {
                  manifests_waybill_id: 'GUIDE NOT FOUND',
                  manifests_tracking_number: value[0],
                  manifests_invoice_weight: value[1],
                  manifests_shipping_cost: value[2],
                  manifests_payment_voucher: 'NOT FOUND',
                };
                unrecorded_manifests.push(elem);
              }
            }
            const manifests_code = await listManifests(bill_code);
            if (manifests_code.length > 0) {
              const concat_manifest = (manifests_code as string[]).concat(
                ...unrecorded_manifests,
                ...manifest_charged_code
              );
              const excelHeader = await colPartialManifest();
              const filepath = await jsonToExcel(concat_manifest, excelHeader);

              const urls = await uploadFileToStore(filepath, 'xlsx', bill_code);

              manifests_bill_code.push(urls);
              fs.unlink(filepath, () => {});
            } else {
              errors.push({
                msg: `No packages were found registered on this invoice: ${bill_code}`,
              });
            }
          }

          let body = {};
          body = {
            manifest_count: manifests.length,
            manifest_charged_count: manifest_charged_code.length,
            waybill_id: action === 'update_supplier' ? null : waybill_id,
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
  const manifest = await findManfest(req.query);

  if (manifest !== null && manifest.length > 0) {
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
  if (waybills.length > 0) {
    const excelHeader = await colPartialManifest();
    const filepath = await jsonToExcel(waybills, excelHeader);

    const urls = await uploadFileToStore(filepath, 'xlsx', bill_code);
    res.json(urls);
    fs.unlink(filepath, () => {});
  } else {
    res.status(404).send();
  }
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

export const paidUpdate = async (req: Request, res: Response) => {
  const client = req.query.client;
  let result;
  if (client === 'customer') {
    const waybill_id = String(req.query.waybill_id);
    result = await paidManifestClient(waybill_id);
  } else {
    const bill_code = req.query.bill_code;
    result = await paidManifest(String(bill_code));
  }

  if (result) {
    res.status(204).send();
  } else {
    res.status(400).send();
  }
};

export const remove = async (req: Request, res: Response) => {
  const waybill_id = req.query.waybill_id;
  const manifest = await findByWaybillId(String(waybill_id));
  await removeManifest(manifest);

  res.sendStatus(200);
};

export const xlsxBill = async (req: Request, res: Response) => {
  try {
    const { waybill_id, carrier, address, email } = req.body;
    const filepath = await createBill(
      waybill_id,
      carrier,
      address,
      email
    );
    const urls = await uploadFileToStore(filepath, 'xlsx');
    res.json(urls);
    fs.unlink(filepath, () => {});
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
