import { UserModel } from '../../../src/api/models/user.model';

let newUser = {
  name: 'Jeanette Ramirez',
  password: 'chivas',
  email: 'jeanette.ramirez@outlook.com',
  admin: false,
  username: 'ramirez'
};

export default (restore, arr) => {
  describe('User', () => {

    restore();

    describe('getAll', () => {
      it('should exist the method getAll()', () => {
        global.chai.expect(UserModel.getAll).to.exist;
        global.chai.expect(UserModel.getAll).to.be.a('function');
      });

      it('should return users array', (done) => {
        UserModel.getAll()
          .then((data) => {
            global.chai.expect(data).to.be.an('array');
            global.chai.expect(data).to.have.lengthOf(arr.length);
            global.chai.expect(data[0]).to.have.all.keys(['id', 'name', 'username', 'email', 'admin']);
            done();
          })
          .catch(error => done(error));
      });
    });

    describe('getUser', () => {
      it('should exist the method getUser()', () => {
        global.chai.expect(UserModel.getUser).to.exist;
        global.chai.expect(UserModel.getUser).to.be.a('function');
      });

      it('should return undefined when id invalid', (done) => {
        UserModel.getUser(0)
          .then((data) => {
            global.chai.expect(data).to.be.undefined;
            done();
          })
          .catch(error => done(error));
      });

      it('should return task object when success', (done) => {
        UserModel.getAll()
          .then((data) => UserModel.getUser(data[0].id))
          .then((data) => {
            global.chai.expect(data).to.be.an('object');
            global.chai.expect(data).to.have.all.keys(['id', 'name', 'username', 'password', 'email', 'admin']);
            done();
          })
          .catch(error => done(error));
      });
    });

    describe('postUser', () => {
      it('should exist the method postUser()', () => {
        global.chai.expect(UserModel.postUser).to.exist;
        global.chai.expect(UserModel.postUser).to.be.a('function');
      });

      it('should return object when success', (done) => {
        UserModel.postUser(newUser)
          .then((data) => {
            global.chai.expect(data).to.be.an('object');
            global.chai.expect(data).to.have.all.keys(['command', 'rows']);
            global.chai.expect(data).to.have.property('command', 'INSERT');
            global.chai.expect(data).to.have.property('rows', 1);
            done();
          })
          .catch(error => done(error));
      });
    });

    describe('putTask', () => {
      it('should exist the method putUser()', () => {
        global.chai.expect(UserModel.putUser).to.exist;
        global.chai.expect(UserModel.putUser).to.be.a('function');
      });

      it('should return object when id invalid', (done) => {
        UserModel.putUser({
          id: 0,
          name: 'update'
        })
          .then((data) => {
            global.chai.expect(data).to.be.an('object');
            global.chai.expect(data).to.have.all.keys(['command', 'rows']);
            global.chai.expect(data).to.have.property('command', 'UPDATE');
            global.chai.expect(data).to.have.property('rows', 0);
            done();
          })
          .catch(error => done(error));
      });

      it('should return object when success', (done) => {
        UserModel.getAll()
          .then((data) => {
            let id = data.filter(element => element.username == newUser.username)[0].id;
            return UserModel.putUser({ id, name: 'Josephine Carroll' })
          })
          .then((data) => {
            global.chai.expect(data).to.be.an('object');
            global.chai.expect(data).to.have.all.keys(['command', 'rows']);
            global.chai.expect(data).to.have.property('command', 'UPDATE');
            global.chai.expect(data).to.have.property('rows', 1);
            done();
          })
          .catch(error => done(error));
      });
    });

    describe('deleteTask', () => {
      it('should exist the method deleteUser()', () => {
        global.chai.expect(UserModel.deleteUser).to.exist;
        global.chai.expect(UserModel.deleteUser).to.be.a('function');
      });

      it('should return object when id invalid', (done) => {
        UserModel.deleteUser(0)
          .then((data) => {
            global.chai.expect(data).to.be.an('object');
            global.chai.expect(data).to.have.all.keys(['command', 'rows']);
            global.chai.expect(data).to.have.property('command', 'DELETE');
            global.chai.expect(data).to.have.property('rows', 0);
            done();
          })
          .catch(error => done(error));
      });

      it('should return object when success', (done) => {
        UserModel.getAll()
          .then((data) => {
            let id = data.filter(element => element.username == newUser.username)[0].id;
            return UserModel.deleteUser(id);
          })
          .then((data) => {
            global.chai.expect(data).to.be.an('object');
            global.chai.expect(data).to.have.all.keys(['command', 'rows']);
            global.chai.expect(data).to.have.property('command', 'DELETE');
            global.chai.expect(data).to.have.property('rows', 1);
            done();
          })
          .catch(error => done(error));
      });
    });
  });
};
