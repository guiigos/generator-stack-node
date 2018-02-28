import httpstatus from 'http-status';

const route = '/api/v1/user';
let bearer;

let newUser = {
  name: 'Jeanette Ramirez',
  password: 'chivas',
  email: 'jeanette.ramirez@outlook.com',
  admin: false,
  username: 'ramirez'
};

export default (server, token, restore, arr) => {
  describe('User', () => {

    restore();
    token((done, tkn) => {
      done();
      bearer = tkn;
    });

    describe(`GET ${route}`, () => {
      it('should return status `Unauthorized` when not autenticate', (done) => {
        global.chai.request(server)
          .get(`${route}`)
          .then(res => {
            global.chai.expect(true).to.be.false;
            done();
          })
          .catch(error => {
            global.chai.expect(error.status).exist;
            global.chai.expect(error.status).to.equal(httpstatus.UNAUTHORIZED);
            done();
          });
      });

      it('should return users array when access valid', (done) => {
        global.chai.request(server)
          .get(`${route}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${bearer}`)
          .then(res => {
            global.chai.expect(res.status).to.equal(httpstatus.OK);
            global.chai.expect(res.body).to.be.an('object');
            global.chai.expect(res.body).to.have.all.keys(['data', 'status', 'timestamp']);
            done();
          })
          .catch(error => done(error));
      });
    });

    describe(`GET ${route}/:id`, () => {
      it('should return status `Unauthorized` when not autenticate', (done) => {
        global.chai.request(server)
          .get(`${route}/${1}`)
          .then(res => {
            global.chai.expect(true).to.be.false;
            done();
          })
          .catch(error => {
            global.chai.expect(error.status).exist;
            global.chai.expect(error.status).to.equal(httpstatus.UNAUTHORIZED);
            done();
          });
      });

      it('should return status `Payment Required` when not informed parameters', (done) => {
        global.chai.request(server)
          .get(`${route}/0`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `bearer ${bearer}`)
          .then(res => {
            global.chai.expect(true).to.be.false;
            done();
          })
          .catch(error => {
            global.chai.expect(error.status).exist;
            global.chai.expect(error.status).to.equal(httpstatus.PAYMENT_REQUIRED);
            done();
          });
      });

      it('should return task object when access valid', (done) => {
        global.chai.request(server)
          .get(`${route}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `bearer ${bearer}`)
          .then(res => {
            return global.chai.request(server)
              .get(`${route}/${res.body.data[0].id}`)
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Authorization', `bearer ${bearer}`);
          })
          .then(res => {
            global.chai.expect(res.status).to.equal(httpstatus.OK);
            global.chai.expect(res.body).to.be.an('object');
            global.chai.expect(res.body).to.have.all.keys(['data', 'status', 'timestamp']);
            done();
          })
          .catch(error => done(error));
      });
    });

    describe(`POST ${route}`, () => {
      it('should return status `Unauthorized` when not autenticate', (done) => {
        global.chai.request(server)
          .post(`${route}`)
          .then(res => {
            global.chai.expect(true).to.be.false;
            done();
          })
          .catch(error => {
            global.chai.expect(error.status).exist;
            global.chai.expect(error.status).to.equal(httpstatus.UNAUTHORIZED);
            done();
          });
      });

      it('should return status `Payment Required` when not informed parameters', (done) => {
        global.chai.request(server)
          .post(`${route}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `bearer ${bearer}`)
          .then(res => {
            global.chai.expect(true).to.be.false;
            done();
          })
          .catch(error => {
            global.chai.expect(error.status).exist;
            global.chai.expect(error.status).to.equal(httpstatus.PAYMENT_REQUIRED);
            done();
          });
      });

      it('should return task object when access valid', (done) => {
        global.chai.request(server)
          .post(`${route}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `bearer ${bearer}`)
          .send(newUser)
          .then(res => {
            global.chai.expect(res.status).to.equal(httpstatus.CREATED);
            global.chai.expect(res.body).to.be.an('object');
            global.chai.expect(res.body).to.have.all.keys(['data', 'status', 'timestamp']);
            done();
          })
          .catch(error => done(error));
      });
    });

    describe(`PUT ${route}/:id`, () => {
      it('should return status `Unauthorized` when not autenticate', (done) => {
        global.chai.request(server)
          .put(`${route}/${1}`)
          .then(res => {
            global.chai.expect(true).to.be.false;
            done();
          })
          .catch(error => {
            global.chai.expect(error.status).exist;
            global.chai.expect(error.status).to.equal(httpstatus.UNAUTHORIZED);
            done();
          });
      });

      it('should return status `Payment Required` when not informed parameters', (done) => {
        global.chai.request(server)
          .put(`${route}/0`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `bearer ${bearer}`)
          .then(res => {
            global.chai.expect(true).to.be.false;
            done();
          })
          .catch(error => {
            global.chai.expect(error.status).exist;
            global.chai.expect(error.status).to.equal(httpstatus.PAYMENT_REQUIRED);
            done();
          });
      });

      it('should return task object when access valid', (done) => {
        global.chai.request(server)
          .get(`${route}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `bearer ${bearer}`)
          .then(res => {
            let id = res.body.data.filter(element => element.username == newUser.username)[0].id;
            return global.chai.request(server)
              .put(`${route}/${id}`)
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Authorization', `bearer ${bearer}`)
              .send({
                name: 'Josephine Carroll'
              });
          })
          .then(res => {
            global.chai.expect(res.status).to.equal(httpstatus.OK);
            global.chai.expect(res.body).to.be.an('object');
            global.chai.expect(res.body).to.have.all.keys(['data', 'status', 'timestamp']);
            done();
          })
          .catch(error => done(error));
      });
    });

    describe(`DELETE ${route}/:id`, () => {
      it('should return status `Unauthorized` when not autenticate', (done) => {
        global.chai.request(server)
          .delete(`${route}/${1}`)
          .then(res => {
            global.chai.expect(true).to.be.false;
            done();
          })
          .catch(error => {
            global.chai.expect(error.status).exist;
            global.chai.expect(error.status).to.equal(httpstatus.UNAUTHORIZED);
            done();
          });
      });

      it('should return status `Payment Required` when not informed parameters', (done) => {
        global.chai.request(server)
          .delete(`${route}/0`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `bearer ${bearer}`)
          .then(res => {
            global.chai.expect(true).to.be.false;
            done();
          })
          .catch(error => {
            global.chai.expect(error.status).exist;
            global.chai.expect(error.status).to.equal(httpstatus.PAYMENT_REQUIRED);
            done();
          });
      });

      it('should return task object when access valid', (done) => {
        global.chai.request(server)
          .get(`${route}`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `bearer ${bearer}`)
          .then(res => {
            let id = res.body.data.filter(element => element.username == newUser.username)[0].id;
            return global.chai.request(server)
              .delete(`${route}/${id}`)
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .set('Authorization', `bearer ${bearer}`);
          })
          .then(res => {
            global.chai.expect(res.status).to.equal(httpstatus.ACCEPTED);
            global.chai.expect(res.body).to.be.an('object');
            global.chai.expect(res.body).to.have.all.keys(['data', 'status', 'timestamp']);
            done();
          })
          .catch(error => done(error));
      });
    });
  });
};
