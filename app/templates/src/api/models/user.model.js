class AccountModel {
  static validAccess(user, password) {
    return new Promise((resolve, reject) => {
      let conn;

      return global.db.connect()
        .then((client) => {
          conn = client;

          const sql =
            `SELECT
              id,
              name,
              username
             FROM users
             WHERE
              username=$1 AND
              password=$2`;

          const params = [
            user,
            password,
          ];

          return conn.query(sql, params);
        })
        .then((result) => {
          conn.release();
          resolve(result.rows[0] ? Object.assign({}, result.rows[0]) : undefined);
        })
        .catch(connectError => reject(connectError));
    });
  }

  static validToken(payload) {
    return new Promise((resolve, reject) => {
      let conn;

      return global.db.connect()
        .then((client) => {
          conn = client;

          const sql =
            `SELECT
              id
             FROM users
             WHERE
              id=$1 AND
              name=$2 AND
              username=$3`;

          const params = [
            payload.id,
            payload.name,
            payload.username,
          ];

          return conn.query(sql, params);
        })
        .then((result) => {
          conn.release();
          resolve(result.rows[0] ? Object.assign({}, result.rows[0]) : undefined);
        })
        .catch(connectError => reject(connectError));
    });
  }
}

class UserModel {
  static getAll() {
    return new Promise((resolve, reject) => {
      let conn;

      global.db.connect()
        .then((client) => {
          conn = client;

          const sql =
            `SELECT
              id,
              name,
              username,
              email,
              admin
             FROM users`;

          return conn.query(sql);
        })
        .then((result) => {
          conn.release();
          resolve(result.rows);
        })
        .catch(connectError => reject(connectError));
    });
  }

  static getUser(id) {
    return new Promise((resolve, reject) => {
      let conn;

      return global.db.connect()
        .then((client) => {
          conn = client;

          const sql =
            `SELECT *
             FROM users
             WHERE id=$1`;

          const params = [
            id,
          ];

          return conn.query(sql, params);
        })
        .then((result) => {
          conn.release();
          resolve(result.rows[0] ? Object.assign({}, result.rows[0]) : undefined);
        })
        .catch(connectError => reject(connectError));
    });
  }

  static postUser(user) {
    return new Promise((resolve, reject) => {
      let conn;

      return global.db.connect()
        .then((client) => {
          conn = client;

          const sql =
            `SELECT COUNT(id)
             FROM users
             WHERE username=$1`;

          const params = [
            Object.prototype.hasOwnProperty.call(user, 'username') ? user.username : '',
          ];

          return conn.query(sql, params);
        })
        .then((result) => {
          if (Object.assign({}, result.rows[0]).count > 0) return false;

          const sql =
            `INSERT INTO users
             (
               name,
               username,
               password,
               email,
               admin
             )
             VALUES
             (
               $1, $2, $3, $4, $5
             )`;

          const params = [
            Object.prototype.hasOwnProperty.call(user, 'name') ? user.name : '',
            Object.prototype.hasOwnProperty.call(user, 'username') ? user.username : '',
            Object.prototype.hasOwnProperty.call(user, 'password') ? user.password : '',
            Object.prototype.hasOwnProperty.call(user, 'email') ? user.email : '',
            Object.prototype.hasOwnProperty.call(user, 'admin') ? user.admin : false,
          ];

          return conn.query(sql, params);
        })
        .then((result) => {
          conn.release();
          resolve({
            command: result ? result.command : '',
            rows: result ? result.rowCount : 0,
          });
        })
        .catch(connectError => reject(connectError));
    });
  }

  static putUser(user) {
    return new Promise((resolve, reject) => {
      let conn;

      return global.db.connect()
        .then((client) => {
          conn = client;

          const arr = [];
          const params = [];

          if (Object.prototype.hasOwnProperty.call(user, 'name') && user.name) arr.push('name');
          if (Object.prototype.hasOwnProperty.call(user, 'email') && user.email) arr.push('email');
          if (Object.prototype.hasOwnProperty.call(user, 'admin') && user.admin) arr.push('admin');
          if (Object.prototype.hasOwnProperty.call(user, 'password') && user.password) arr.push('password');

          if (arr.length === 0) return false;

          const sql = `UPDATE users SET ${arr.map((elem) => {
            params.push(user[elem]);
            return `${elem}=$${arr.indexOf(elem) + 1}`;
          }).join(', ')} WHERE id=$${arr.length + 1}`;
          params.push(user.id);

          return conn.query(sql, params);
        })
        .then((result) => {
          conn.release();
          resolve({
            command: result ? result.command : '',
            rows: result ? result.rowCount : 0,
          });
        })
        .catch(connectError => reject(connectError));
    });
  }

  static deleteUser(id) {
    return new Promise((resolve, reject) => {
      let conn;

      return global.db.connect()
        .then((client) => {
          conn = client;

          const sql =
            `DELETE FROM users
             WHERE id=$1`;

          const params = [
            id,
          ];

          return conn.query(sql, params);
        })
        .then((result) => {
          conn.release();
          resolve({
            command: result.command,
            rows: result.rowCount,
          });
        })
        .catch(connectError => reject(connectError));
    });
  }
}

export { UserModel, AccountModel };
