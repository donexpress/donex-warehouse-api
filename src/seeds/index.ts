import { createAOSWarehouse } from '../context/aos_warehouse';
import { createShelf } from '../context/shelf';
import { createUser } from '../context/user';
import { User } from '../models/user.model';
import { AppDataSource } from '../config/ormconfig';

const amount = 10;
const Seed = async () => {
  await AppDataSource.initialize()

  for (let i = 0; i < amount; i++) {
    const warehouse = await createAOSWarehouse({
      code: `COD${i}MX${i + 1}`,
      name: `COD${i}MEX${i + 1}`,
      country: 'MX',
    });
    console.log(warehouse)
    const user = (await createUser({
      username: `tmpusr${i + 1}`,
      nickname: `tmp${i + 1}`,
      label_code: '',
      password: 'user123.*',
    })) as User[];
    console.log(user)
    for (let j = 0; j < amount; j++) {
      for (let k = 0; k < amount; k++) {
        const shelf = await createShelf({
          partition_table: j+1,
          warehouse_id: warehouse.id,
          number_of_shelves: k+1,
          layers: k+1,
          column_ammount: k+1
        });
        console.log(shelf)
      }
    }
  }
};

Seed()