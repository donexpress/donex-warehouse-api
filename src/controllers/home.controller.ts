import { Request, Response } from 'express';
import countries from 'countries-list';
import { countUser } from '../context/user';
import { countStaff } from '../context/staff';
import { countRole } from '../context/role';
import { countUserLevel } from '../context/user_level';
import { countPaymentMethods } from '../context/payment_method';
import { countDepataments } from '../context/organization';
import { countWarehouse } from '../context/warehouse';
import { countServices } from '../context/service';
import { countAOSWarehouse } from '../context/aos_warehouse';
import { countStoragePlan } from '../context/storage_plan';
import { countOutputPlan } from '../context/output_plan';
import { countLineClassification } from '../context/line_classification';
import { countRegionalDivision } from '../context/regional_division';
import { getCurrentUser } from '../middlewares';

export const country = async (req: Request, res: Response) => {
  const countryCodes = Object.keys(countries.countries);
  const countryBody = countryCodes.map((code) => countries.countries[code]);
  res.json(countryBody);
};

export const counts = async (req: Request, res: Response) => {
  const user_count = await countUser();
  const staff_count = await countStaff();
  const role_count = await countRole();
  const level_count = await countUserLevel();
  const payment_level_count = await countPaymentMethods();
  const organization_count = await countDepataments();
  const warehouse_count = await countAOSWarehouse();
  const service_count = await countServices();
  const supplier_count = 0;
  const storage_plan_count = await countStoragePlan();
  const output_plan_count = await countOutputPlan();
  const cargo_station_count = await countWarehouse();
  const line_clasification_count = await countLineClassification();
  const regional_division_count = await countRegionalDivision();

  res.json({
    user_count,
    staff_count,
    role_count,
    level_count,
    payment_level_count,
    organization_count,
    warehouse_count,
    service_count,
    supplier_count,
    storage_plan_count,
    output_plan_count,
    cargo_station_count,
    line_clasification_count,
    regional_division_count
  });
};