import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.PORT) || 3307,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //entities: [Episode],
  //autoLoadEntities: true,
  synchronize: true,
  // subscribers: [__dirname + '/domain/subscribers/*.subscriber{.ts,.js}'],
  migrations: ['src/migration/*{.ts,.js}'],
  entities: [__dirname + 'src/**/*.entity{.ts,.js}']
};

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize();

export default dataSource;

