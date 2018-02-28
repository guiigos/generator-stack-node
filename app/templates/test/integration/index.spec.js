import http from 'http';
import cryptojs from 'crypto-js';
import app from '../../src/api/app';
import routes from "./modules/routes.spec";
import authentication from "./modules/authentication.spec";
import user from "./modules/user.spec.js";

const server = http.createServer(app);

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

var token = (callback) => {
  before((done) => {
    global.chai.request(server)
      .post(`/token`)
      .send({
        username: arrUsers[0].username,
        password: arrUsers[0].password,
      })
      .then(res => callback(done, res.body.token))
      .catch(error => done(error));
  });
}

describe('Integration', () => {
  routes(server);
  authentication(server, restore, arrUsers);
  user(server, token, restore, arrUsers);
});

after((done) => {
  if(!global.db.ending) global.db.end();
  server.close(done);
});
