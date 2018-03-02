import { Pool } from 'pg';
import debug from 'debug';

export default (database) => {
  const connection = {
    connect: () => {
      const pool = new Pool(database);
      return pool;
    },
    prepare: (db) => {
      let conn;

      db.connect()
        .then((client) => {
          conn = client;
          return undefined;
        })
        .then(() => conn.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name TEXT, username TEXT, password TEXT, email TEXT, admin BOOLEAN)'))
        .then(() => conn.release())
        .catch(error => debug('debug:server')(error));
    },
  };

  return connection;
};
