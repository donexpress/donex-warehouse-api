import { Request, Response } from 'express';
import {
  countRegionalDivision,
  createRegionalDivision,
  listRegionalDivision,
  removeRegionalDivision,
  showRegionalDivision,
  updateRegionalDivision,
} from '../context/regional_division';
import { RegionalDivision } from '../models/regional_division.model';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countRegionalDivision();
    const roles = await listRegionalDivision(current_page, number_of_rows);
    res.json(roles);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const role = await showRegionalDivision(Number(req.params.id));
    res.json(role);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countRegionalDivision();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const regional_division = await createRegionalDivision(req.body);
  if(regional_division instanceof RegionalDivision) {
    res.status(201).json(regional_division);
  } else {
    res.status(422).json(regional_division)
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateRegionalDivision(
      Number(req.params.id),
      req.body
    );
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeRegionalDivision(Number(req.params.id));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
