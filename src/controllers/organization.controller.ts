import { Request, Response } from 'express';
import {
  countDepataments,
  createDepataments,
  listDepataments,
  removeDepataments,
  showDepataments,
  updateDepataments,
} from '../context/organization';
import { Organization } from '../models/organization.model';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countDepataments();
    const organization = await listDepataments(current_page, number_of_rows);
    res.json(organization);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const organization = await showDepataments(Number(req.params.id));
    res.json(organization);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countDepataments();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const organization = await createDepataments(req.body);
  if(organization instanceof Organization) {
    res.status(201).json(organization);
  } else {
    console.log(organization)
    res.status(422).json(organization)
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateDepataments(Number(req.params.id), req.body);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeDepataments(Number(req.params.id));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
