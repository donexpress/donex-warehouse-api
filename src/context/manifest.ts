import { ValidationError } from 'class-validator';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Manifest } from '../models/manifest.model';
import { ConsigneeAddress } from '../models/consignee_address.model';
import { ShipperAddress } from '../models/shipper_address.model';
import { FindOptionsWhere } from 'typeorm';

export const findManifest = async (
  current_page: number,
  number_of_rows: number,
  params
) => {
  let where: FindOptionsWhere<Manifest> | FindOptionsWhere<Manifest>[] = null;
  return AppDataSource.manager.find(Manifest, {
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

export const countManifest = async (waybill_id) => {
  return AppDataSource.manager.count(Manifest, { where: { waybill_id } });
};

export const createManifest = async (
  manifest_data,
  shipper_data,
  consignee_data
) => {
  const repository = await AppDataSource.getRepository(Manifest);
  const manifest = repository.create(manifest_data);
  const manifest_save = await validateContext(AppDataSource, manifest);
  console.log(manifest_save);

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

export const updateManifest = async (
  manifest: Manifest,
  params: Partial<Manifest>
): Promise<Manifest | ValidationError[]> => {
  const update_manifest = { ...manifest, ...params };
  return await validateContext(AppDataSource, update_manifest);
};

export const manifestByState = async () => {};
