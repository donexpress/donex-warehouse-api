import { Request, Response } from 'express';
import {
  countSubsidiary,
  createSubsidiary,
  getSubsidiaryStates,
  listSubsidiary,
  removeSubsidiary,
  showSubsidiary,
  updateSubsidiary,
} from '../context/subsidiary';
import { Subsidiary } from '../models/subsidiary.model';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countSubsidiary();
    const roles = await listSubsidiary(current_page, number_of_rows);
    res.json(roles);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const role = await showSubsidiary(Number(req.params.id));
    res.json(role);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countSubsidiary();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const subsidiary = await createSubsidiary(req.body);
  if(subsidiary instanceof Subsidiary) {
    res.status(201).json(subsidiary);
  } else {
    res.status(422).json(subsidiary);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateSubsidiary(Number(req.params.id), req.body);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeSubsidiary(Number(req.params.id));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const states = (req: Request, res: Response) => {
  res.send({states: getSubsidiaryStates()})
}