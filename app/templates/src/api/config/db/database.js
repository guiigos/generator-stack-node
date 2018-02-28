import { Pool } from 'pg';

export default (database) => {
  const connection = {
    connect: () => {
      const pool = new Pool(database);
      return pool;
    },
  };

  return connection;
};
