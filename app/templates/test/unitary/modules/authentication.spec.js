import cryptojs from 'crypto-js';
import { AccountModel } from '../../../src/api/models/user.model';

export default (restore, arr) => {
  describe('Authentication', () => {

    restore();

    it('should exist the method validAccess()', () => {
      global.chai.expect(AccountModel.validAccess).to.exist;
      global.chai.expect(AccountModel.validAccess).to.be.a('function');
    });

    it('should return undefined when access invalid', (done) => {
      AccountModel.validAccess('', '')
        .then((data) => {
          global.chai.expect(data).to.be.undefined;
          done();
        })
        .catch(error => done(error));
    });

    it('should return user object when access valid', (done) => {
      AccountModel.validAccess(arr[0].username, cryptojs.MD5(arr[0].password).toString())
        .then(data => {
          global.chai.expect(data).to.be.an('object');
          global.chai.expect(data).to.have.all.keys(['id', 'name', 'username']);
          global.chai.expect(data.name).to.be.equal(arr[0].name);
          done();
        })
        .catch(error => done(error));
    });
  });
};
