import { DataSource, DataSourceOptions } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const isLocal =
  process.env.DB_HOST.includes('localhost') ||
  process.env.DB_HOST.includes('amazonaws');

export const dbdatasource: DataSourceOptions = {
  // TypeORM PostgreSQL DB Drivers
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PSSWRD,
  // Database name
  database: process.env.DB_BASE,
  // Synchronize database schema with entities
  synchronize: true,
  ssl: !isLocal,
  extra: isLocal ? {} : { ssl: { rejectUnauthorized: false } },
  // TypeORM Entity
  entities: ['dist/src/api/**/*.entity.js'],
  // Your Migration path
  migrations: ['dist/src/migrations/*.js'],
  migrationsTableName: 'excedentes_migrations',
};

const dataSource = new DataSource(dbdatasource);
export default dataSource;
