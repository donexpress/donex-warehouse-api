import { Request, Response } from "express";
import {
  countDepataments,
  createDepataments,
  listDepataments,
  removeDepataments,
  showDepataments,
  updateDepataments,
} from "../context/departament";

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countDepataments();
    const departments = await listDepataments(current_page, number_of_rows);
    res.json(departments);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const department = await showDepataments(Number(req.params.id));
    res.json(department);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countDepataments();
    res.json({ count });
  } catch (e) {
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const department = createDepataments(req.body);
    res.status(201).json(department);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateDepataments(Number(req.params.id), req.body);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeDepataments(Number(req.params.id));
    res.status(200).json(result);
  } catch (e) {
    res.status(500).send(e);
  }
};
