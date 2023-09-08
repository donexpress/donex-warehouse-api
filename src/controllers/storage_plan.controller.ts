import { Request, Response } from 'express';
import {
  countStoragePlan,
  createStoragePlan,
  filterByState,
  listStoragePlan,
  removeStoragePlan,
  showStoragePlan,
  updateStoragePlan,
} from '../context/storage_plan';
import { StoragePlan } from '../models/storage_plan.model';
import { getCurrentUser } from '../middlewares';

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
    if (!state) {
      const storage_plans = await listStoragePlan(
        current_page,
        number_of_rows,
        query == undefined ? '' : String(query)
      );
      res.json(storage_plans);
    } else {
      const storage_plans = await filterByState(
        current_page,
        number_of_rows,
        state == undefined ? 1 : Number(state)
      );
      res.json(storage_plans);
    }
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
    const count = await countStoragePlan();
    res.json({ count });
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
    console.log(result);
    res.status(422).json(result);
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
