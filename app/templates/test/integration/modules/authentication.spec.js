import httpstatus from 'http-status';

export default (server, restore, arr) => {
  describe('Authentication', () => {

    restore();

    it('should return status `Payment Required` when not informed parameters', (done) => {
      global.chai.request(server)
        .post(`/token`)
        .send({
          username: '',
          password: '',
        })
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

    it('should return status `Unauthorized` when access invalid', (done) => {
      global.chai.request(server)
        .post(`/token`)
        .send({
          username: 'error',
          password: 'error',
        })
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

    it('should return status `OK` and token when access valid', (done) => {
      global.chai.request(server)
        .post(`/token`)
        .send({
          username: arr[0].username,
          password: arr[0].password,
        })
        .then(res => {
          global.chai.expect(res.status).exist;
          global.chai.expect(res.status).to.equal(httpstatus.OK);
          global.chai.expect(res.body).to.be.an('object');
          global.chai.expect(res.body).to.have.all.keys(['token', 'status']);
          done();
        })
        .catch(error => done(error));
    });
  });
};
