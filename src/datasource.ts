import { DataSource, DataSourceOptions } from 'typeorm';
import * as ormConfig from './public.orm.config';
export const AppDataSource = new DataSource(ormConfig as DataSourceOptions);
