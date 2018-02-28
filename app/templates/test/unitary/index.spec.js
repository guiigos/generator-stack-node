import cryptojs from 'crypto-js';
import connection from '../../src/api/config/db/database';
import database from "./modules/database.spec";
import authentication from "./modules/authentication.spec";
import user from "./modules/user.spec.js";

var arrUsers = require('../data/user');

var restore = () => {
  before((done) => {
    let conn;

    global.db.connect()
      .then(client => {
        conn = client;
        return;
      })
      .then(() => conn.query('DELETE FROM users'))
      .then(() => {
        let arrPromise = [];

        arrUsers.forEach((user) => {
          arrPromise.push(conn.query(`INSERT INTO users (name, username, password, email, admin) VALUES ($1, $2, $3, $4, $5)`, [user.name, user.username, cryptojs.MD5(user.password).toString(), user.email, user.admin]))
        });

        return Promise.all(arrPromise);
      })
      .then(() => {
        conn.release();
        done();
      })
      .catch(connectError => done(connectError));
  });

  after((done) => {
    let conn;

    global.db.connect()
      .then(client => {
        conn = client;
        return;
      })
      .then(() => conn.query('DELETE FROM users'))
      .then(() => {
        conn.release();
        done();
      })
      .catch(connectError => done(connectError));
  });
}

before(() => {
  if (!global.db || global.db.ending) global.db = connection(global.config).connect();
});

describe('Unitary', () => {
  database();
  authentication(restore, arrUsers);
  user(restore, arrUsers);
});

after(() => {
  if (!global.db.ending) global.db.end();
});

