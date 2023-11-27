import { createAOSWarehouse } from '../context/aos_warehouse';
import { createShelf } from '../context/shelf';
import { createUser } from '../context/user';
import { User } from '../models/user.model';
import { AppDataSource } from '../config/ormconfig';
import { createWarehouse, listWarehouse } from '../context/warehouse';
import { createStaff, listStaff } from '../context/staff';
import { createRole } from '../context/role';
import { getOutputPlanByState } from '../context/output_plan';
import { countOutputPlan } from '../context/output_plan';
import { dispatchBulkBoxes } from '../context/packing_list';
const args = process.argv;
const isProd = args.find((el) => el === 'prod=true');
const amount = 10;
const Seed = async () => {
  await AppDataSource.initialize();
  let warehouse = (await listWarehouse(1, 1))[0];
  if (!warehouse) {
    warehouse = await createWarehouse({
      name: 'Prueba',
      english_name: 'Test',
      receiving_area: null,
      principal: null,
      contact_phone: null,
      state_id: null,
      address: null,
      city: null,
      province: null,
      country: null,
      cp: null,
      shared_warehouse_system_code: null,
      shared_warehouse_docking_code: null,
      customer_order_number_rules: null,
    });
  }

  let staff = (await listStaff(1, 1, ''))[0];
  if (!staff) {
    staff = await createStaff({
      username: 'weisslogia',
      chinesse_name: 'Jose',
      english_name: 'Jose',
      password: '123',
      email: null,
      phone: null,
      state_id: null,
      organization_id: null,
      affiliations: [warehouse.id],
      role_id: 1,
      observations: null,
    });
  }

  for (let i = 0; i < amount; i++) {
    const warehouse = await createAOSWarehouse({
      code: `COD${i}MX${i + 1}`,
      name: `COD${i}MEX${i + 1}`,
      country: 'MX',
    });
    console.log(warehouse);
    const user = (await createUser({
      username: `tmpusr${i + 1}`,
      nickname: `tmp${i + 1}`,
      label_code: '',
      password: 'user123.*',
    })) as User[];
    console.log(user);
    for (let j = 0; j < amount; j++) {
      for (let k = 0; k < amount; k++) {
        const shelf = await createShelf({
          partition_table: j + 1,
          warehouse_id: warehouse.id,
          number_of_shelves: k + 1,
          layers: k + 1,
          column_ammount: k + 1,
        });
        console.log(shelf);
      }
    }
  }
};

const ProdSeed = async () => {
  await AppDataSource.initialize();
  const staff = await createStaff({
    username: 'donexadmin',
    chinesse_name: 'Donexpress',
    english_name: 'Donexpress',
    password: 'qwertydonexwarehouse.*',
    email: null,
    phone: null,
    state_id: null,
    organization_id: null,
    affiliations: [],
    role_id: 1,
    observations: null,
    state: 'normal',
  });
  const roles = [
    {
      name: 'Administrador',
      type: 'ADMIN',
      scope: null,
    },
    {
      name: 'Operador de almacenes',
      type: 'OPERATION',
      scope: null,
    },
    {
      name: 'Servicio al Cliente',
      type: 'CUSTOMER_SERVICE',
      scope: null,
    },
    {
      name: 'Ventas',
      type: 'SALE',
      scope: null,
    },
    {
      name: 'Finanzas',
      type: 'FINANCE',
      scope: null,
    },
  ];
  console.log(staff);
  for (let i = 0; i < roles.length; i++) {
    const element = roles[i];
    const role = await createRole(element);
    console.log(role);
  }
};

const dispatch_boxes = async () => {
  const count = await countOutputPlan();
  const staff = (await listStaff(1, 100, '')).find((el) => el.role_id === 1);
  const output_plans = await getOutputPlanByState(
    1,
    count,
    'dispatched',
    staff
  );
  for (let i = 0; i < output_plans.length; i++) {
    const output_plan = output_plans[i];
    await dispatchBulkBoxes(output_plan.case_numbers);
  }
};

const doSeed = async () => {
  if (isProd) {
    await ProdSeed();
  } else {
    await Seed();
  }
  await dispatch_boxes();
};

doSeed()
