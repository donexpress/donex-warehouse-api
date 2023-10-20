import { ValidationError } from 'class-validator';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { Manifest } from '../models/manifest';
import { ReceiverAddress } from '../models/receiver_address';
import { SenderAddress } from '../models/sender_address';

export const find = async (
  current_page: number,
  number_of_rows: number,
  waybill_id: string
) => {
  return AppDataSource.manager.find(Manifest, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: { waybill_id },
    order: {
      created_at: 'DESC',
    },
    relations: ['sender_addreses', 'receiver_addreses'],
  });
};

export const findByTracking = async (tracking: string) => {
  return await AppDataSource.manager.findOne(Manifest, {
    where: { tracking_number: tracking },
  });
};

export const create = async (manifest_data) => {
  const repository = await AppDataSource.getRepository(Manifest);
  const manifest = repository.create(manifest_data);
  const save_manifest = await validateContext(AppDataSource, manifest);

  if (save_manifest instanceof Manifest) {
    let sender = {
      manifest_id: save_manifest.id,
      name_sender: manifest_data.name_sender,
      tax_id: manifest_data.tax_id_sender,
      address1: manifest_data.address1_sender,
      address2: manifest_data.address2_sender,
      city: manifest_data.city_sender,
      country: manifest_data.country_sender,
      code_zip: manifest_data.code_zip_sender,
      phone_number: manifest_data.phone_number_sender,
      email: manifest_data.email_sender,
    };

    const repository_sender = await AppDataSource.getRepository(SenderAddress);
    const sender_data = repository_sender.create(sender);
    await validateContext(AppDataSource, sender_data);

    let receiver = {
      manifest_id: save_manifest.id,
      name_sender: manifest_data.name_receiver,
      tax_id: manifest_data.tax_id_receiver,
      address1: manifest_data.address1_receiver,
      address2: manifest_data.address2_receiver,
      city: manifest_data.city_receiver,
      country: manifest_data.country_receiver,
      code_zip: manifest_data.code_zip_receiver,
      phone_number: manifest_data.phone_number_receiver,
      email: manifest_data.email_receiver,
    };

    const repository_receiver = await AppDataSource.getRepository(
      ReceiverAddress
    );
    const receiver_data = repository_receiver.create(receiver);
    await validateContext(AppDataSource, receiver_data);
  }
};

export const updateManifest = async (
  manifest: Manifest,
  params: Partial<Manifest>
): Promise<Manifest | ValidationError[]> => {
  const update_manifest = { ...manifest, ...params };
  return await validateContext(AppDataSource, update_manifest);
};

export const manifestByState = async () => {};
