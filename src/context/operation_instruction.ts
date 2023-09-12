import { FindOptionsWhere, ILike, UpdateResult } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { validateContext } from '../helpers/validate';
import { OperationInstruction } from '../models/instruction_operation.model';
import { ValidationError } from 'class-validator';

export const listOI = async (
  current_page: number,
  number_of_rows: number,
  state: string | ''
): Promise<OperationInstruction[] | null> => {
  return AppDataSource.manager.find(OperationInstruction, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: { state },
    order: {
      created_at: 'DESC',
    },
  });
};

export const listOIByOutputPlanId = async (
  current_page: number,
  number_of_rows: number,
  state: string | '',
  output_plan_id: number
): Promise<OperationInstruction[] | null> => {
  const where_query =
    state === '' ? { output_plan_id } : { state, output_plan_id };
  return AppDataSource.manager.find(OperationInstruction, {
    take: number_of_rows,
    skip: (current_page - 1) * number_of_rows,
    where: where_query,
    order: {
      created_at: 'DESC',
    },
  });
};

export const countOI = async () => {
  return AppDataSource.manager.count(OperationInstruction);
};

export const showOI = async (
  id: number
): Promise<OperationInstruction | null> => {
  return await AppDataSource.manager.findOne(OperationInstruction, {
    where: { id },
  });
};

export const showOIByWarehouseId = async (
  warehouse_id: number
): Promise<OperationInstruction | null> => {
  return await AppDataSource.manager.findOne(OperationInstruction, {
    where: { warehouse_id },
  });
};

export const createOI = async (
  params
): Promise<OperationInstruction | ValidationError[]> => {
  const repository = await AppDataSource.getRepository(OperationInstruction);
  const result = repository.create(params);
  return await validateContext(AppDataSource, result);
};

export const updateOI = async (id: number, params): Promise<UpdateResult> => {
  const repository = await AppDataSource.getRepository(OperationInstruction);
  return await repository.update({ id }, params);
};

export const removeOI = async (id: number) => {
  const repository = await AppDataSource.getRepository(OperationInstruction);
  return await repository.delete({ id });
};

export const changeStatusOI = async (
  id: number,
  state
): Promise<UpdateResult> => {
  const repository = await AppDataSource.getRepository(OperationInstruction);
  return await repository.update({ id }, state);
};
