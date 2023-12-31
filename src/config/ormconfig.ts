import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: isNaN(Number(process.env.DB_PORT)) ? 5432 : Number(process.env.DB_PORT),
  //username: process.env.DB_USERNAME ?? 'postgres',
  //password: process.env.DB_PASSWORD ?? 'postgres',
  //database: process.env.DB_NAME ?? 'warehouse_dev',
  url: process.env.DATABASE_URL,
  extra: {
  ssl: { rejectUnauthorized: false },
  },
  synchronize: false,
  logging: false,
  name: 'default',
  entities: ['dist/**/*.model.js'],
  migrations: ['dist/**/migrations/**/*.js'],
  subscribers: [],
});
