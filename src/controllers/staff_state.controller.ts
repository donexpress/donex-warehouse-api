import { Request, Response } from 'express';
import {
  countStaffState,
  createStaffState,
  listStaffState,
  removeStaffState,
  showStaffState,
  updateStaffState,
} from '../context/staff_state';
import { StaffState } from '../models/staff_state.model';
import states from '../config/states';

export const index = async (req: Request, res: Response) => {
  res.json(states.staff);
};

/* export const show = async (req: Request, res: Response) => {
  try {
    const state = await showStaffState(Number(req.params.id));
    res.json(state);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countStaffState();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const state = await createStaffState(req.body);
  if(state instanceof StaffState) {
    res.status(201).json(state);
  } else {
    res.status(422).json(state)
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateStaffState(Number(req.params.id), req.body);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeStaffState(Number(req.params.id));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}; */
