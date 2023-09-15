import { Request, Response } from 'express';
import {
  countWarehouseState,
  createWarehouseState,
  listWarehouseState,
  removeWarehouseState,
  showWarehouseState,
  updateWarehouseState,
} from '../context/warehouse_state';
import { WarehouseState } from '../models/warehouse_state.model';
import states from '../config/states';

export const index = async (req: Request, res: Response) => {
  res.json(states.warehouse);
};

/* export const show = async (req: Request, res: Response) => {
  try {
    const state = await showWarehouseState(Number(req.params.id));
    res.json(state);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countWarehouseState();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const state = await createWarehouseState(req.body);
  if(state instanceof WarehouseState) {
    res.status(201).json(state);
  } else {
    res.status(422).json(state)
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateWarehouseState(Number(req.params.id), req.body);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeWarehouseState(Number(req.params.id));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}; */
