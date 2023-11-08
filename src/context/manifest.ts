import { ValidationError } from 'class-validator';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Manifest } from '../models/manifest.model';
import { ConsigneeAddress } from '../models/consignee_address.model';
import { ShipperAddress } from '../models/shipper_address.model';
import { Between, FindOptionsWhere } from 'typeorm';

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

export const findByTrackingAndCarrier = async (
  tracking_number: string,
  carrier: string
) => {
  return await AppDataSource.manager.findOne(Manifest, {
    where: { tracking_number, carrier },
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

export const countManifestWaybillAndCarrier = async (
  waybill_id: string,
  carrier: string
) => {
  return AppDataSource.manager.count(Manifest, {
    where: { waybill_id, carrier },
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
  const manifest = repository.create(manifest_data);
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

  return {
    shipping_cost: sum_cost,
    sale_price: sum_sale_price,
    difference_sum: sum_sale_price - sum_cost,
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

export const selectByWaybill = async () => {
  return await AppDataSource.createQueryBuilder(Manifest, 'manifests')
    .select('DISTINCT manifests.waybill_id', 'waybill_id')
    .orderBy('manifests.waybill_id')
    .getRawMany();
};

export const listManifest = async (): Promise<Manifest[] | []> => {
  return await AppDataSource.createQueryBuilder(Manifest, 'manifests')
    .distinctOn(['manifests.waybill_id'])
    .select(['manifests.waybill_id', 'manifests.payment_voucher'])
    .orderBy('manifests.waybill_id')
    .getRawMany();
};


export const removeManifest = async (manifests: Manifest[]) => {
  await AppDataSource.getRepository(Manifest).remove(manifests);
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
    where.client_reference = params.client_reference;
  }

  return where;
};
