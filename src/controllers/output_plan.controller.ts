import { Request, Response } from 'express';
import {
  changeOutputPlanState,
  countAllOutputPlan,
  countOutputPlan,
  createOutputPlan,
  getAddresses,
  getDestinations,
  getOutputPlanByFilter,
  getOutputPlanByState,
  listOutputPlan,
  nonBoxesOnExitPlans,
  pullBoxes,
  removeOutputPlan,
  returnBoxes,
  showOutputPlan,
  updateOutputPlan,
} from '../context/output_plan';
import { OutputPlan } from '../models/output_plan.model';
import { getStates } from '../helpers/states';
import states from '../config/states';
import { getCurrentUser } from '../middlewares';
import { UpdateResult } from 'typeorm';

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
    //let outpu_plans = [];
    const current_user = getCurrentUser(req);

    const outpu_plans = await listOutputPlan(
      current_page,
      number_of_rows,
      state == undefined ? '' : String(state),
      query == undefined ? '' : String(query),
      current_user
    );

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
    const current_user = getCurrentUser(req);
    const count = await countAllOutputPlan(current_user);
    res.json(count);
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
    if (result['warning']) {
      if (result['warning'] === 'own') {
        res.status(401).json(result);
      } else {
        res.status(422).json(result);
      }
      return;
    }
    if (result instanceof UpdateResult && result.affected === 0) {
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

export const listStates = (req: Request, res: Response) => {
  res.send({ states: getStates(states.output_plan) });
};

export const destinations = (req: Request, res: Response) => {
  res.send({ destinations: getDestinations() });
};

export const addresses = (req: Request, res: Response) => {
  res.send({ addresses: getAddresses() });
};

export const getByFilter = async (req: Request, res: Response) => {
  res.send(await getOutputPlanByFilter(req.body));
};

export const changeState = async (req: Request, res: Response) => {
  try {
    const result = await changeOutputPlanState(
      Number(req.params.id),
      req.body.state
    );
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const removeBoxes = async (req: Request, res: Response) => {
  try {
    const result = await returnBoxes(Number(req.params.id), req.body);
    if (result['warning']) {
      if (result['warning'] === 'own') {
        res.status(401).json(result);
      } else {
        res.status(422).json(result);
      }
      return;
    }
    if (result instanceof UpdateResult && result.affected === 0) {
      res.status(404).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const getNonBoxesOnExitPlans = async (req: Request, res: Response) => {
  try {
    const result = await nonBoxesOnExitPlans(
      req.body.excluded_output_plan,
      req.body.case_numbers
    );
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const pull_boxes = async (req: Request, res: Response) => {
  try {
    const result = await pullBoxes(req.body);
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
