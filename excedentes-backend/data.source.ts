import { DataSource, DataSourceOptions } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const isLocal = true;

export const dbdatasource: DataSourceOptions = {
  // TypeORM PostgreSQL DB Drivers
  type: 'postgres',
  host: 'aws-0-us-west-1.pooler.supabase.com',
  port: 6543,
  username: 'postgres.yibpjqmzvcpkkeuzqxdz',
  password: 'Ln9r5@CB4eDfMW',
  // Database name
  database: 'postgres',
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
