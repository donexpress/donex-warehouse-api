import { Request, Response } from 'express';
import {
  countOutputPlan,
  createOutputPlan,
  getOutputPlanByState,
  getOutputPlanStates,
  listOutputPlan,
  removeOutputPlan,
  showOutputPlan,
  updateOutputPlan,
} from '../context/output_plan';
import { OutputPlan } from '../models/output_plan.model';

export const index = async (req: Request, res: Response) => {
  try {
    const current_page = req.query.current_page
      ? Number(req.query.current_page)
      : 1;
    const number_of_rows = req.query.number_of_rows
      ? Number(req.query.number_of_rows)
      : await countOutputPlan();

    const query = req.query.query;
    const state = req.query.state;
    let outpu_plans = []
    if(state && state !== 'all') {
      outpu_plans = await getOutputPlanByState(current_page, number_of_rows, String(state))
    } else {
      outpu_plans = await listOutputPlan(
        current_page,
        number_of_rows,
        query == undefined ? '' : String(query)
      );
    }
    res.json(outpu_plans);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const show = async (req: Request, res: Response) => {
  try {
    const organization = await showOutputPlan(Number(req.params.id));
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
    const count = await countOutputPlan();
    res.json({ count });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const create = async (req: Request, res: Response) => {
  const new_output_plan = await createOutputPlan(req.body);
  if (new_output_plan instanceof OutputPlan) {
    res.status(201).json(new_output_plan);
  } else {
    res.status(422).json(new_output_plan);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const result = await updateOutputPlan(Number(req.params.id), req.body);
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
    const result = await removeOutputPlan(Number(req.params.id));
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

export const states = (req: Request, res: Response) => {
  res.send({states: getOutputPlanStates()})
}
