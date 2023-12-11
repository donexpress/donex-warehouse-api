import { OutputPlan } from "../models/output_plan.model";

export interface OutputPlanFilter extends OutputPlan {
    initialDate: string,
    finalDate: string,
    location: string[]
}