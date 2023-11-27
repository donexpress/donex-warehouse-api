import { Request, Response } from 'express';
import {
  countStaff,
  createStaff,
  listStaff,
  removeStaff,
  showStaff,
  updateStaff,
} from '../context/staff';
import { Staff } from '../models/staff.model';
import { UpdateResult } from 'typeorm';
import { getStates } from '../helpers/states';
import states from '../config/states';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countStaff();
    const query = req.query.query;
    const state = req.query.state;
    let users = [];
    users = await listStaff(
      current_page,
      number_of_rows,
      query == undefined ? '' : String(query),
      state == undefined ? '' : String(state)
    );
    res.json(users);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const user = await showStaff(Number(req.params.id));
    if (!user) {
      res.status(404).json(user);
    } else {
      res.json(user);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countStaff();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const user = await createStaff(req.body);
  if (user instanceof Staff) {
    res.status(201).json(user);
    //@ts-ignore
  } else if (user.message) {
    res.status(409).json(user);
  } else {
    res.status(422).json(user);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateStaff(Number(req.params.id), req.body);
    if (result instanceof UpdateResult) {
      if (result.affected === 0) {
        res.status(404).json(result);
      } else {
        res.status(200).json(result);
      }
    } else {
      res.status(409).json(result)
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeStaff(Number(req.params.id));
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
  res.send({ states: getStates(states.staff) });
};
