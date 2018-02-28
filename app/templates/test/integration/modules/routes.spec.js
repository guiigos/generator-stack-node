import httpstatus from 'http-status';

export default (server) => {
  describe('Routes', () => {
    it('should return status `Not Found` when page not exists', (done) => {
      global.chai.request(server)
        .get(`/not/exists`)
        .then(res => {
          global.chai.expect(true).to.be.false;
          done();
        })
        .catch(error => {
          global.chai.expect(error.status).exist;
          global.chai.expect(error.status).to.equal(httpstatus.NOT_FOUND);
          done();
        });
    });
  });
};
