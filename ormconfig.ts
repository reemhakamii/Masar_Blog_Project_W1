import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'root',
  password: 'Reemii888',
  database: 'blog',
  //entities: [Episode],
  //autoLoadEntities: true,
  synchronize: true, // todo: not safe for production and we should use migrations instead
  // subscribers: [__dirname + '/domain/subscribers/*.subscriber{.ts,.js}'],
  migrations: ['src/migration/*{.ts,.js}'],
    entities: ['src/**/*.entity{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize();

export default dataSource;

