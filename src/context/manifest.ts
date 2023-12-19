import { ValidationError } from 'class-validator';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Manifest } from '../models/manifest.model';
import { ConsigneeAddress } from '../models/consignee_address.model';
import { ShipperAddress } from '../models/shipper_address.model';
import { Between, FindOptionsWhere, UpdateResult } from 'typeorm';
import { generateBillXlsx } from '../helpers/xlsx';
import { shipping_invoice } from '../config/manifest';

export const findManifest = async (
  current_page: number,
  number_of_rows: number,
  params
) => {
  const where = await getWhere(params);

  return await AppDataSource.manager.find(Manifest, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where,
    order: {
      created_at: 'DESC',
    },
    relations: ['shipper_address', 'consignee_address'],
  });
};

export const findByTracking = async (tracking: string) => {
  return await AppDataSource.manager.findOne(Manifest, {
    where: { tracking_number: tracking },
  });
};

export const findByWaybillId = async (waybill_id: string) => {
  return await AppDataSource.manager.find(Manifest, {
    where: { waybill_id },
  });
};

export const findByWaybillAndCarrier = async (
  waybill_id: string,
  carrier: string
) => {
  return await AppDataSource.manager.find(Manifest, {
    where: { waybill_id, carrier },
  });
};

export const findAllManifest = async (params) => {
  const where = await getWhere(params);
  return await AppDataSource.manager.find(Manifest, {
    where: where,
  });
};

export const countManifest = async (params) => {
  const where = await getWhere(params);
  return AppDataSource.manager.count(Manifest, { where: where });
};

export const createManifest = async (
  manifest_data,
  shipper_data,
  consignee_data
) => {
  const repository = await AppDataSource.getRepository(Manifest);
  const manifest = await repository.create(manifest_data);
  const manifest_save = await validateContext(AppDataSource, manifest);

  if (manifest_save instanceof Manifest) {
    await createShipperAddress({
      ...shipper_data,
      manifest_id: manifest_save.id,
    });

    await createConsigneeAddress({
      ...consignee_data,
      manifest_id: manifest_save.id,
    });
  }

  return manifest_save;
};

export const createShipperAddress = async (shipper_addreses) => {
  const repository_shipper = await AppDataSource.getRepository(ShipperAddress);
  const shipper_data = repository_shipper.create(shipper_addreses);
  await validateContext(AppDataSource, shipper_data);
};

export const createConsigneeAddress = async (consignee_addreses) => {
  const repository_shipper = await AppDataSource.getRepository(
    ConsigneeAddress
  );
  const consignee_data = repository_shipper.create(consignee_addreses);
  await validateContext(AppDataSource, consignee_data);
};

export const sumManifest = async (waybill_id, carrier) => {
  const sum_cost = await AppDataSource.getRepository(Manifest).sum(
    'shipping_cost',
    {
      waybill_id,
      carrier,
    }
  );

  const sum_sale_price = await AppDataSource.getRepository(Manifest).sum(
    'sale_price',
    {
      waybill_id,
      carrier,
    }
  );

  const count_manifest = await AppDataSource.getRepository(Manifest).count({
    where: {
      waybill_id,
      carrier,
    },
  });

  return {
    shipping_cost: sum_cost === null ? 0 : sum_cost.toFixed(2),
    count_manifest: count_manifest,
    sale_price: sum_sale_price === null ? 0 : sum_sale_price.toFixed(2),
    difference_sum:
      Number(sum_cost.toFixed(2)) - Number(sum_sale_price.toFixed(2)),
  };
};

export const updateManifest = async (
  manifest: Manifest,
  params: Partial<Manifest>
): Promise<Manifest | ValidationError[]> => {
  await AppDataSource.manager
    .getRepository(Manifest)
    .update(manifest.id, params);

  return manifest;
};

export const paidManifest = async (
  bill_code: string
): Promise<UpdateResult | null> => {
  return await AppDataSource.manager
    .getRepository(Manifest)
    .update({ payment_voucher: bill_code }, { paid: true });
};

export const paidManifestClient = async (
  waybill_id: string
): Promise<UpdateResult | null> => {
  return await AppDataSource.manager
    .getRepository(Manifest)
    .update({ waybill_id: waybill_id }, { state: 'collected' });
};

export const selectByWaybill = async () => {
  return await AppDataSource.createQueryBuilder(Manifest, 'manifests')
    .select(['DISTINCT manifests.waybill_id', 'waybill_id', 'carrier'])
    .orderBy('manifests.waybill_id')
    .getRawMany();
};

export const selectDistintByWaybill = async () => {
  return await AppDataSource.createQueryBuilder(Manifest, 'manifests')
    .select('DISTINCT manifests.waybill_id', 'waybill_id')
    .orderBy('manifests.waybill_id')
    .getRawMany();
};

export const selectByWaybillBySort = async (params) => {
  if (params.bill_code) {
    return await AppDataSource.createQueryBuilder(Manifest, 'manifests')
      .select('DISTINCT manifests.waybill_id', 'waybill_id')
      .orderBy('manifests.waybill_id')
      .where(`manifests.payment_voucher = '${params.bill_code}'`)
      .getRawMany();
  }

  if (params.start_date && params.end_date) {
    let final_date = new Date(params.end_date);
    final_date.setDate(final_date.getDate() + 1);
    return await AppDataSource.createQueryBuilder(Manifest, 'manifests')
      .select('DISTINCT manifests.waybill_id', 'waybill_id')
      .orderBy('manifests.waybill_id')
      .where(`manifests.created_at >= '${params.start_date}'`)
      .andWhere(`manifests.created_at < '${final_date.toISOString()}'`)
      .getRawMany();
  }

  if (params.start_date && params.end_date && params.bill_code) {
    let final_date = new Date(params.end_date);
    final_date.setDate(final_date.getDate() + 1);
    return await AppDataSource.createQueryBuilder(Manifest, 'manifests')
      .select('DISTINCT manifests.waybill_id', 'waybill_id')
      .orderBy('manifests.waybill_id')
      .where(`manifests.created_at >= '${params.start_date}'`)
      .andWhere(`manifests.created_at < '${final_date.toISOString()}'`)
      .andWhere(`manifests.payment_voucher = '${params.bill_code}'`)
      .getRawMany();
  }
};

export const summaryByWaybill = async (params) => {
  /* const waybills =
    params.bill_code || params.start_date
      ? await selectByWaybillBySort(params)
      : await selectDistintByWaybill(); */
  const waybills = await runQuery(params);
  let summary = [];

  for (let i = 0; i < waybills.length; i++) {
    const element = waybills[i];
    const waybill_id = element.waybill_id;

    const manifest = await AppDataSource.getRepository(Manifest).findOne({
      where: {
        waybill_id,
      },
    });

    const count = await AppDataSource.getRepository(Manifest).count({
      where: {
        waybill_id,
      },
    });

    const kilo_count = await AppDataSource.getRepository(Manifest).sum(
      'unit_weigth',
      {
        waybill_id,
      }
    );

    const sum_cost = await AppDataSource.getRepository(Manifest).sum(
      'shipping_cost',
      {
        waybill_id,
      }
    );

    const sum_sale_price = await AppDataSource.getRepository(Manifest).sum(
      'sale_price',
      {
        waybill_id,
      }
    );

    const count_collected = await AppDataSource.getRepository(Manifest).count({
      where: {
        waybill_id,
        state: 'collected',
      },
    });

    const count_pending = await AppDataSource.getRepository(Manifest).count({
      where: {
        waybill_id,
        state: 'pending',
      },
    });

    const count_paid = await AppDataSource.getRepository(Manifest).count({
      where: {
        waybill_id,
        paid: true,
      },
    });

    const count_not_paid = await AppDataSource.getRepository(Manifest).count({
      where: {
        waybill_id,
        paid: false,
      },
    });

    const body = {
      MWB: waybill_id,
      quantity_package: count,
      quantity_kilograms: Number(kilo_count.toFixed(3)),
      quantity_shipping_cost:
        sum_cost === null ? 0 : Number(sum_cost.toFixed(2)),
      quantity_sale_price:
        sum_sale_price === null ? 0 : Number(sum_sale_price.toFixed(2)),
      earnings: Number(sum_cost.toFixed(2)) - Number(sum_sale_price.toFixed(2)),
      created_at: manifest.created_at,
      collected: count_collected,
      pending: count_pending,
      paid: count_paid,
      not_paid: count_not_paid,
    };

    summary.push(body);
  }
  return summary;
};

export const listManifests = async (
  bill_code: string
): Promise<Manifest[] | []> => {
  return await AppDataSource.createQueryBuilder(Manifest, 'manifests')
    .where('manifests.payment_voucher = :bill_code', { bill_code: bill_code })
    .select([
      'manifests.waybill_id',
      'manifests.tracking_number',
      'manifests.invoice_weight',
      'manifests.shipping_cost',
      'manifests.payment_voucher',
    ])
    .getRawMany();
};

export const removeManifest = async (manifests: Manifest[]) => {
  await AppDataSource.manager.transaction(
    async (transactionalEntityManager) => {
      manifests.forEach(async (manifest) => {
        await transactionalEntityManager
          .getRepository(ConsigneeAddress)
          .delete(manifest.id);
        await transactionalEntityManager
          .getRepository(ShipperAddress)
          .delete(manifest.id);
      });

      await transactionalEntityManager
        .getRepository(Manifest)
        .remove(manifests);
    }
  );
};

export const getWhere = (params) => {
  const where: FindOptionsWhere<Manifest> | FindOptionsWhere<Manifest>[] = {};

  if (params.waybill_id) {
    where.waybill_id = params.waybill_id;
  }

  if (params.carrier) {
    where.carrier = params.carrier;
  }

  if (params.tracking_number) {
    where.tracking_number = params.tracking_number;
  }

  if (params.paid) {
    where.paid = params.paid;
  }

  if (params.client_reference) {
    where.manifest_name = params.client_reference;
  }

  if (params.bill_code) {
    where.payment_voucher = params.bill_code;
  }

  if (params.state) {
    where.state = params.state;
  }

  if (params.start_date && !params.end_date) {
    const start_date_to = new Date(params.start_date);
    const end_date_to = new Date(params.start_date);
    end_date_to.setDate(end_date_to.getDate() + 1);
    where.created_at = Between(start_date_to, end_date_to);
  }

  if (params.start_date && params.end_date) {
    const start_date_to = new Date(params.start_date);
    const end_date_to = new Date(params.end_date);
    end_date_to.setDate(end_date_to.getDate() + 1);
    where.created_at = Between(start_date_to, end_date_to);
  }

  return where;
};

const runQuery = async (params) => {
  return await AppDataSource.createQueryBuilder(Manifest, 'manifests')
    .select(buildSelectClause(params))
    .where(buildWhereClause(params), buildParams(params))
    .getRawMany();
};

const buildSelectClause = (params) => {
  if (params.is_carrier) {
    return `[DISTINCT waybill_id, carrier]`;
  } else {
    return `DISTINCT waybill_id`;
  }
};

const buildWhereClause = (params) => {
  if (params.bill_code) {
    return `payment_voucher = :bill_code`;
  }
  if (params.bill_code && params.start_date) {
    return `payment_voucher = :bill_code and created_at >= :start_date and created_at <= :end_date`;
  }

  if (params.start_date) {
    return `created_at >= :start_date and created_at <= :end_date`;
  }
  return `created_at IS NOT NULL`;
};

const buildParams = (params) => {
  if (params.bill_code) {
    return { bill_code: params.bill_code };
  }

  if (params.bill_code && params.start_date) {
    let final_date = new Date(params.end_date);
    final_date.setDate(final_date.getDate() + 1);
    return {
      bill_code: params.bill_code,
      start_date: params.start_date,
      end_date: final_date.toISOString(),
    };
  }

  if (params.start_date) {
    let final_date = new Date(params.end_date);
    final_date.setDate(final_date.getDate() + 1);
    return {
      start_date: params.start_date,
      end_date: final_date.toISOString(),
    };
  }
};

export const createBill = async (waybill_id: string, carrier: string, eta) => {
  const manifests = await AppDataSource.manager.find(Manifest, {
    where: { waybill_id, carrier },
    order: {
      created_at: 'DESC',
    },
    relations: ['consignee_address'],
  });
  const xlsx_headers = [
    '序号',
    '到达日期',
    '跟踪号',
    '客户运单号',
    '服务类型',
    '发往国家',
    '收费重KG',
    '金额USD',
    '备注',
  ];
  const xlsx_data = [];
  manifests.forEach((manifest, index) => {
    xlsx_data.push({
      number: index + 1,
      eta,
      traking_number: manifest.tracking_number,
      reference_number: manifest.client_reference,
      chanel: manifest.carrier,
      country: manifest.consignee_address.country_code,
      weight: manifest.weigth,
      usd_amount: manifest.sale_price,
      observations: manifest.item_description,
    });
  });

  const xlsx = await generateBillXlsx(
    xlsx_headers,
    xlsx_data,
    shipping_invoice.address,
    shipping_invoice.email,
    manifests[0].manifest_name,
    waybill_id,
    manifests[0].payment_voucher
  );
  return xlsx;
};
