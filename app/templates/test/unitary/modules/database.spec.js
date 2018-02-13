export default () => {
  describe('DataBase', () => {
    it('has connection to database', (done) => {
      let conn;

      global.db.connect()
        .then(client => {
          conn = client;
          return;
        })
        .then(() => conn.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name TEXT, username TEXT, password TEXT, email TEXT, admin BOOLEAN)'))
        .then(() => {
          conn.release();
          done();
        })
        .catch(error => done(error));
    });
  });
};
