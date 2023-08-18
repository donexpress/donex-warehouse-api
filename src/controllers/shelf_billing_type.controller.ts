import { Request, Response } from 'express';
import { countShelfBillingType, createShelfBillingType, listShelfBillingType, removeShelfBillingType, showShelfBillingType, updateShelfBillingType } from '../context/shelf_billing_type';
import { ShelfBillingType } from '../models/shelf_billing_type.model';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countShelfBillingType();
    const states = await listShelfBillingType(current_page, number_of_rows);
    res.json(states);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const result = await showShelfBillingType(Number(req.params.id));
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countShelfBillingType();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await createShelfBillingType(req.body);
    if(result instanceof ShelfBillingType) {
        res.status(201).json(result);
    } else {
        res.status(422).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateShelfBillingType(Number(req.params.id), req.body);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeShelfBillingType(Number(req.params.id));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
