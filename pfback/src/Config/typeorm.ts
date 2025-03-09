import { DataSource, DataSourceOptions } from 'typeorm';
import { config as envConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

envConfig({
  path: '.env',
});

const database = {
  type: 'postgres',
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
 // logging: true,
  // dropSchema: true,
};

 export default registerAs('typeorm', () => database);

 export const connection = new DataSource(database as DataSourceOptions);
