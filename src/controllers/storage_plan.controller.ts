import { Request, Response } from 'express';
import {
  changeStoragePlanState,
  countAllStoragePlan,
  countStoragePlan,
  createStoragePlan,
  createStoragePlanMulti,
  listStoragePlan,
  removeStoragePlan,
  showStoragePlan,
  updateStoragePlan,
} from '../context/storage_plan';
import { StoragePlan } from '../models/storage_plan.model';
import { getCurrentUser } from '../middlewares';
import states from '../config/states';
import { getStates } from '../helpers/states';
import { getUserByUsername } from '../context/user';
import { User } from '../models/user.model';
import { getAosWarehouseByCode } from '../context/aos_warehouse';
import { AOSWarehouse } from '../models/aos_warehouse.model';
//import { getFormatExcel } from '../helpers/excel';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countStoragePlan();
    const query = req.query.query;
    const state = req.query.state;
    const current_user = getCurrentUser(req);
    const storage_plans = await listStoragePlan(
      current_page,
      number_of_rows,
      query == undefined ? '' : String(query),
      state == undefined ? '' : String(state),
      current_user
    );
    res.json(storage_plans);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const result = await showStoragePlan(Number(req.params.id));
    if (!result) {
      res.status(404).json(result);
    } else {
      res.json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const current_user = getCurrentUser(req);
    const count = await countAllStoragePlan(current_user);
    res.json(count);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  //@ts-ignore
  const result = await createStoragePlan(req.body, parseInt(user.id));
  if (result instanceof StoragePlan) {
    res.status(201).json(result);
  } else {
    res.status(422).json(result);
  }
};

export const createMulti = async (req: Request, res: Response) => {
  const current_user = getCurrentUser(req);
  console.log(current_user);
  //@ts-ignore
  const user_id = parseInt(current_user.id);
  const storage_plans = req.body;
  let storage_plan_save = [];
  for (let i = 0; i < storage_plans.length; i++) {
    const storage_plan_body = storage_plans[i];
    storage_plan_body.state = states.entry_plan.to_be_storage.value;
    console.log(storage_plan_body.username);
    const user = await getUserByUsername(storage_plan_body.username);
    console.log(user);
    const AOWarehouse = await getAosWarehouseByCode(
      storage_plan_body.warehouse_code
    );
    storage_plan_body.user_id = user instanceof User ? user.id : null;
    storage_plan_body.warehouse_id =
      AOWarehouse instanceof AOSWarehouse ? AOWarehouse.id : null;
    console.log(storage_plan_body);
    const storage_plan = await createStoragePlanMulti(
      storage_plan_body,
      user_id
    );
    storage_plan_save.push(storage_plan);
  }

  if (storage_plan_save.length === storage_plans.length) {
    return res.sendStatus(201);
  } else {
    res.status(422).send('An unexpected error has happened. Please check it');
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateStoragePlan(Number(req.params.id), req.body);
    if (!result || result.affected === 0) {
      res.status(404).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeStoragePlan(Number(req.params.id));
    if (result.affected === 0) {
      res.status(404).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const listStates = (req: Request, res: Response) => {
  res.send({ states: getStates(states.entry_plan) });
};

export const changeState = async (req: Request, res: Response) => {
  try {
    const result = await changeStoragePlanState(
      Number(req.params.id),
      req.body.state
    );
    if (!result || result.affected === 0) {
      res.status(404).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
