import * as ormConfig from './public.orm.config';

import { join } from 'path';

module.exports = {
  ...ormConfig,
  entities: [join(__dirname, './modules/tenanted/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/tenanted/*{.ts,.js}')],
};
