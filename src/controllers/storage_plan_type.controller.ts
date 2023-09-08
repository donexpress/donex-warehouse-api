import { Request, Response } from 'express';
import { countStoragePlanState, createStoragePlanState, listStoragePlanState, removeStoragePlan, showStoragePlanState, updateStoragePlan } from '../context/storage_plan_state';
import { StoragePlan } from '../models/storage_plan.model';
import { getCurrentUser } from '../middlewares';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countStoragePlanState();
    const query = req.query.query;
    const organization = await listStoragePlanState(
      current_page,
      number_of_rows,
      query == undefined ? '' : String(query)
    );
    res.json(organization);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const result = await showStoragePlanState(Number(req.params.id));
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
    const count = await countStoragePlanState();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  //@ts-ignore
  const result = await createStoragePlanState(req.body, parseInt(user.id));
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
