import { Request, Response } from 'express';
import { countLineClassification, createLineClassification, listLineClassification, removeLineClassification, showLineClassification, updateLineClassification } from '../context/line_classification';
import { LineClassification } from '../models/line_clasification.model';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countLineClassification();

    const query = req.query.query;
    const organization = await listLineClassification(
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
    const organization = await showLineClassification(Number(req.params.id));
    if (!organization) {
      res.status(404).json(organization);
    } else {
      res.json(organization);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const count = async (req: Request, res: Response) => {
  try {
    const count = await countLineClassification();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const new_line_classification = await createLineClassification(req.body);
  if (new_line_classification instanceof LineClassification) {
    res.status(201).json(new_line_classification);
  } else {
    res.status(422).json(new_line_classification);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateLineClassification(Number(req.params.id), req.body);
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

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await removeLineClassification(Number(req.params.id));
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
