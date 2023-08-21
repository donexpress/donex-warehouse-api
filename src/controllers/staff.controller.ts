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

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countStaff();
    const query = req.query.query;
    const users = await listStaff(
      current_page,
      number_of_rows,
      query == undefined ? '' : String(query)
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
    res.json(user);
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
  } else {
    res.status(422).json(user);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateStaff(Number(req.params.id), req.body);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeStaff(Number(req.params.id));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
