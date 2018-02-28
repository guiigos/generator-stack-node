import httpstatus from 'http-status';
import { Router } from 'express';
import Handlers from '../responses/handlers';
import { UserModel } from '../../models/user.model';

export default () => {
  /**
   * @apiGroup Users
   * @api {get} /api/v1/user User list
   * @apiDescription Lists all users.
   *
   * @apiExample {js} HTTP
   *  var request = require("request");
   *
   *  var options = {
   *    method: 'GET',
   *    url: '[url]/api/v1/user',
   *    headers: {
   *      'authorization': 'Bearer token'
   *    }
   *  };
   *
   *  request(options, function (error, response, body) {
   *    if (error) throw new Error(error);
   *
   *    console.log(body);
   *  });
   *
   * @apiHeader {String} authorization Authentication token.
   *
   * @apiSampleRequest /api/v1/user
   *
   * @apiSuccess (Success (200)) {array} data Return data.
   * @apiSuccess (Success (200)) {int} data.id User code.
   * @apiSuccess (Success (200)) {string} data.name User name.
   * @apiSuccess (Success (200)) {string} data.username User access name.
   * @apiSuccess (Success (200)) {string} data.email User email.
   * @apiSuccess (Success (200)) {boolean} data.admin User is administrator.
   * @apiSuccess (Success (200)) {boolean} status Query status <code>true</code>.
   * @apiSuccess (Success (200)) {int} timestamp Timestamp query.
   *
   * @apiError (Unauthorized (401)) {array} validation Array with invalid fields.
   * @apiError (Unauthorized (401)) {string} validation.location Parameter location.
   * @apiError (Unauthorized (401)) {string} validation.msg Validation message.
   * @apiError (Unauthorized (401)) {boolean} status Authentication status <code>false</code>.
   *
   * @apiSuccessExample {json} Success (200)
   *  {
   *    "data": [
   *      {
   *        "id": 0,
   *        "name": "",
   *        "username": "",
   *        "email": "",
   *        "admin": false
   *      }
   *    ],
   *    "status": true,
   *    "timestamp": 1513945756312
   *  }
   *
   * @apiErrorExample {json} Unauthorized (401)
   *  {
   *    "validation": [{
   *      localtion: "",
   *      msg: "Unauthorized"
   *    }],
   *    "status": false
   *  }
   */
  function getUsers(req, res, next) {
    UserModel.getAll()
      .then(data => Handlers.success(req, res, data))
      .catch(exception => next(exception));
  }

  /**
   * @apiGroup Users
   * @api {get} /api/v1/user/:id User search
   * @apiDescription Performs a specific user search.
   *
   * @apiExample {js} HTTP
   *  var request = require("request");
   *
   *  var options = {
   *    method: 'GET',
   *    url: '[url]/api/v1/user/0',
   *    headers: {
   *      'authorization': 'Bearer token'
   *    }
   *  };
   *
   *  request(options, function (error, response, body) {
   *    if (error) throw new Error(error);
   *
   *    console.log(body);
   *  });
   *
   * @apiHeader {String} authorization Authentication token.
   *
   * @apiSampleRequest /api/v1/user
   *
   * @apiSuccess (Success (200)) {object} data Return data.
   * @apiSuccess (Success (200)) {int} data.id User code.
   * @apiSuccess (Success (200)) {string} data.name User name.
   * @apiSuccess (Success (200)) {string} data.username User access name.
   * @apiSuccess (Success (200)) {string} data.password User access password.
   * @apiSuccess (Success (200)) {string} data.email User email.
   * @apiSuccess (Success (200)) {boolean} data.admin User is administrator.
   * @apiSuccess (Success (200)) {boolean} status Query status <code>true</code>.
   * @apiSuccess (Success (200)) {int} timestamp Timestamp query.
   *
   * @apiError (Unauthorized (401)) {array} validation Array with invalid fields.
   * @apiError (Unauthorized (401)) {string} validation.location Parameter location.
   * @apiError (Unauthorized (401)) {string} validation.msg Validation message.
   * @apiError (Unauthorized (401)) {boolean} status Authentication status <code>false</code>.
   * @apiError (Payment Required (402)) {array} validation Array with invalid fields.
   * @apiError (Payment Required (402)) {string} validation.location Parameter location.
   * @apiError (Payment Required (402)) {string} validation.param Parameter Name.
   * @apiError (Payment Required (402)) {string} validation.msg Validation message.
   * @apiError (Payment Required (402)) {string} [validation.value] Value sent in parameter.
   * @apiError (Payment Required (402)) {boolean} status Authentication status <code>false</code>.
   * @apiError (Not Found (404)) {boolean} status Consulta sem retorno <code>false</code>.
   *
   * @apiSuccessExample {json} Success (200)
   *  {
   *    "data": {
   *      "id": 0,
   *      "name": "",
   *      "username": "",
   *      "password": "",
   *      "email": "",
   *      "admin": false,
   *      "inactive": false
   *    },
   *    "status": true,
   *    "timestamp": 1513945756312
   *  }
   *
   * @apiErrorExample {json} Unauthorized (401)
   *  {
   *    "validation": [{
   *      localtion: "",
   *      msg: "Unauthorized"
   *    }],
   *    "status": false
   *  }
   *
   * @apiErrorExample {json} Payment Required (402)
   *  {
   *    "validation": [
   *      {
   *        "location": "",
   *        "param": "",
   *        "msg": "",
   *        "value": ""
   *      }
   *    ],
   *    "status": false
   *  }
   *
   * @apiErrorExample {json} Not Found (404)
   *  {
   *    "status": false
   *  }
   */
  function getUser(req, res, next) {
    req.checkParams('id')
      .notEmpty()
      .withMessage('ID is required')
      .isInt({ min: 1 })
      .withMessage('ID must be Int type');

    req.getValidationResult()
      .then((erros) => {
        if (!erros.isEmpty()) Handlers.validation(req, res, erros.array());
        else {
          req.sanitize('id').toInt();

          UserModel.getUser(req.params.id)
            .then((data) => {
              if (data) Handlers.success(req, res, data);
              else Handlers.error(req, res);
            })
            .catch(exception => next(exception));
        }
      })
      .catch(exception => next(exception));
  }

  /**
   * @apiGroup Users
   * @api {post} /api/v1/user/ Include user
   * @apiDescription Performs the inclusion of a new user.
   *
   * @apiExample {js} HTTP
   *  var request = require("request");
   *
   *  var options = {
   *    method: 'POST',
   *    url: '[url]/api/v1/user',
   *    headers: {
   *      'authorization': 'Bearer token',
   *      'content-type': 'application/x-www-form-urlencoded'
   *    },
   *    form: {
   *      name: '',
   *      username: '',
   *      password: '',
   *      email: '',
   *      admin: false
   *    }
   *  };
   *
   *  request(options, function (error, response, body) {
   *    if (error) throw new Error(error);
   *
   *    console.log(body);
   *  });
   *
   * @apiParam {String} name User name.
   * @apiParam {String} username User access name.
   * @apiParam {String} password User access password.
   * @apiParam {String} email User email.
   * @apiParam {Boolean} admin User is administrator.
   * @apiHeader {String} authorization Authentication token.
   *
   * @apiSampleRequest /api/v1/user
   *
   * @apiSuccess (Success (200)) {object} data Return data.
   * @apiSuccess (Success (200)) {string} data.command Done command <code>INSERT</code>.
   * @apiSuccess (Success (200)) {int} data.rows Number of rows affected.
   * @apiSuccess (Success (200)) {boolean} status Query status <code>true</code>.
   * @apiSuccess (Success (200)) {int} timestamp Timestamp query.
   *
   * @apiError (Unauthorized (401)) {array} validation Array with invalid fields.
   * @apiError (Unauthorized (401)) {string} validation.location Parameter location.
   * @apiError (Unauthorized (401)) {string} validation.msg Validation message.
   * @apiError (Unauthorized (401)) {boolean} status Authentication status <code>false</code>.
   * @apiError (Payment Required (402)) {array} validation Array with invalid fields.
   * @apiError (Payment Required (402)) {string} validation.location Parameter location.
   * @apiError (Payment Required (402)) {string} validation.param Parameter Name.
   * @apiError (Payment Required (402)) {string} validation.msg Validation message.
   * @apiError (Payment Required (402)) {string} [validation.value] Value sent in parameter.
   * @apiError (Payment Required (402)) {boolean} status Authentication status <code>false</code>.
   *
   * @apiSuccessExample {json} Success (200)
   *  {
   *    "data": {
   *      "command": "INSERT",
   *      "rows": 0
   *    },
   *    "status": true,
   *    "timestamp": 0
   *  }
   *
   * @apiErrorExample {json} Unauthorized (401)
   *  {
   *    "validation": [{
   *      localtion: "",
   *      msg: "Unauthorized"
   *    }],
   *    "status": false
   *  }
   *
   * @apiErrorExample {json} Payment Required (402)
   *  {
   *    "validation": [
   *      {
   *        "location": "",
   *        "param": "",
   *        "msg": "",
   *        "value": ""
   *      }
   *    ],
   *    "status": false
   *  }
   */
  function postUser(req, res, next) {
    req.checkBody({
      name: {
        notEmpty: {
          errorMessage: 'Name is required',
        },
        isLength: {
          options: {
            min: 5,
            max: 500,
          },
          errorMessage: 'Name must be between 5 and 500 characters',
        },
      },
      username: {
        notEmpty: {
          errorMessage: 'Username is required',
        },
        isLength: {
          options: {
            min: 5,
            max: 20,
          },
          errorMessage: 'Username must be between 5 and 20 characters',
        },
      },
      password: {
        notEmpty: {
          errorMessage: 'Password is required',
        },
        isLength: {
          options: {
            min: 5,
            max: 20,
          },
          errorMessage: 'Password must be between 5 and 20 characters',
        },
      },
      email: {
        notEmpty: {
          errorMessage: 'Email is required',
        },
        isEmail: {
          errorMessage: 'Email must be in the correct format',
        },
      },
      admin: {
        notEmpty: {
          errorMessage: 'Admin is required',
        },
        isBoolean: {
          errorMessage: 'Admin must be Boolean type',
        },
      },
    });

    req.getValidationResult()
      .then((erros) => {
        if (!erros.isEmpty()) Handlers.validation(req, res, erros.array());
        else {
          req.sanitize('name').trim();
          req.sanitize('username').trim();
          req.sanitize('password').trim();
          req.sanitize('password').crypto();
          req.sanitize('email').trim();

          UserModel.postUser({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            admin: req.body.admin,
          })
            .then((data) => {
              if (data.rows === 0) {
                const ret = [{
                  location: 'body',
                  param: 'username',
                  msg: 'Username already exists',
                  value: req.body.username,
                }];

                Handlers.validation(req, res, ret);
              } else Handlers.success(req, res, data, httpstatus.CREATED);
            })
            .catch(exception => next(exception));
        }
      })
      .catch(exception => next(exception));
  }

  /**
   * @apiGroup Users
   * @api {put} /api/v1/user/ Change user
   * @apiDescription Make a user change.
   *
   * @apiExample {js} HTTP
   *  var request = require("request");
   *
   *  var options = {
   *    method: 'PUT',
   *    url: '[url]/api/v1/user/0',
   *    headers: {
   *      'authorization': 'Bearer token',
   *      'content-type': 'application/x-www-form-urlencoded'
   *    },
   *    form: {
   *      id: 0,
   *      name: '',
   *      username: '',
   *      password: '',
   *      email: '',
   *      admin: false
   *    }
   *  };
   *
   *  request(options, function (error, response, body) {
   *    if (error) throw new Error(error);
   *
   *    console.log(body);
   *  });
   *
   * @apiParam {Int} id User code.
   * @apiParam {String} [name] User name.
   * @apiParam {String} [password] User access password.
   * @apiParam {String} [email] User email.
   * @apiParam {Boolean} [admin] User is administrator.
   * @apiHeader {String} authorization Authentication token.
   *
   * @apiSampleRequest /api/v1/user
   *
   * @apiSuccess (Success (200)) {object} data Return data.
   * @apiSuccess (Success (200)) {string} data.command Done command <code>INSERT</code>.
   * @apiSuccess (Success (200)) {int} data.rows Number of rows affected.
   * @apiSuccess (Success (200)) {boolean} status Query status <code>true</code>.
   * @apiSuccess (Success (200)) {int} timestamp Timestamp query.
   *
   * @apiError (Unauthorized (401)) {array} validation Array with invalid fields.
   * @apiError (Unauthorized (401)) {string} validation.location Parameter location.
   * @apiError (Unauthorized (401)) {string} validation.msg Validation message.
   * @apiError (Unauthorized (401)) {boolean} status Authentication status <code>false</code>.
   * @apiError (Payment Required (402)) {array} validation Array with invalid fields.
   * @apiError (Payment Required (402)) {string} validation.location Parameter location.
   * @apiError (Payment Required (402)) {string} validation.param Parameter Name.
   * @apiError (Payment Required (402)) {string} validation.msg Validation message.
   * @apiError (Payment Required (402)) {string} [validation.value] Value sent in parameter.
   * @apiError (Payment Required (402)) {boolean} status Authentication status <code>false</code>.
   * @apiError (Not Found (404)) {boolean} status Consulta sem retorno <code>false</code>.
   *
   * @apiSuccessExample {json} Success (200)
   *  {
   *    "data": {
   *      "command": "UPDATE",
   *      "rows": 0
   *    },
   *    "status": true,
   *    "timestamp": 0
   *  }
   *
   * @apiErrorExample {json} Unauthorized (401)
   *  {
   *    "validation": [{
   *      localtion: "",
   *      msg: "Unauthorized"
   *    }],
   *    "status": false
   *  }
   *
   * @apiErrorExample {json} Payment Required (402)
   *  {
   *    "validation": [
   *      {
   *        "location": "",
   *        "param": "",
   *        "msg": "",
   *        "value": ""
   *      }
   *    ],
   *    "status": false
   *  }
   *
   * @apiErrorExample {json} Not Found (404)
   *  {
   *    "status": false
   *  }
   */
  function putUser(req, res, next) {
    req.checkParams('id')
      .notEmpty()
      .withMessage('ID is required')
      .isInt({ min: 1 })
      .withMessage('ID must be Int type');

    req.checkBody({
      name: {
        optional: true,
        isLength: {
          options: {
            min: 5,
            max: 500,
          },
          errorMessage: 'Name must be between 5 and 500 characters',
        },
      },
      password: {
        optional: true,
        isLength: {
          options: {
            min: 5,
            max: 20,
          },
          errorMessage: 'Password must be between 5 and 20 characters',
        },
      },
      email: {
        optional: true,
        isEmail: {
          errorMessage: 'Email must be in the correct format',
        },
      },
      admin: {
        optional: true,
        isBoolean: {
          errorMessage: 'Admin must be Boolean type',
        },
      },
    });

    req.getValidationResult()
      .then((erros) => {
        if (!erros.isEmpty()) Handlers.validation(req, res, erros.array());
        else {
          req.sanitize('id').toInt();
          req.sanitize('name').trim();
          req.sanitize('password').trim();
          req.sanitize('password').crypto();
          req.sanitize('email').trim();

          UserModel.putUser({
            id: req.params.id,
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            admin: req.body.admin,
          })
            .then((data) => {
              if (data.rows === 0) Handlers.error(req, res);
              else Handlers.success(req, res, data);
            })
            .catch(exception => next(exception));
        }
      })
      .catch(exception => next(exception));
  }

  /**
   * @apiGroup Users
   * @api {delete} /api/v1/user/:id Delete user
   * @apiDescription Deletes a user.
   *
   * @apiExample {js} HTTP
   *  var request = require("request");
   *
   *  var options = {
   *    method: 'DELETE',
   *    url: '[url]/api/v1/user/0',
   *    headers: {
   *      'authorization': 'Bearer token'
   *    }
   *  };
   *
   *  request(options, function (error, response, body) {
   *    if (error) throw new Error(error);
   *
   *    console.log(body);
   *  });
   *
   * @apiHeader {String} authorization Authentication token.
   *
   * @apiSampleRequest /api/v1/user
   *
   * @apiSuccess (Accepted (202)) {object} data Return data.
   * @apiSuccess (Accepted (202)) {string} data.command Done command <code>DELETE</code>.
   * @apiSuccess (Accepted (202)) {int} data.rows Number of rows affected.
   * @apiSuccess (Accepted (202)) {boolean} status Query status <code>true</code>.
   * @apiSuccess (Accepted (202)) {int} timestamp Timestamp query.
   *
   * @apiError (Unauthorized (401)) {array} validation Array with invalid fields.
   * @apiError (Unauthorized (401)) {string} validation.location Parameter location.
   * @apiError (Unauthorized (401)) {string} validation.msg Validation message.
   * @apiError (Unauthorized (401)) {boolean} status Authentication status <code>false</code>.
   * @apiError (Payment Required (402)) {array} validation Array with invalid fields.
   * @apiError (Payment Required (402)) {string} validation.location Parameter location.
   * @apiError (Payment Required (402)) {string} validation.param Parameter Name.
   * @apiError (Payment Required (402)) {string} validation.msg Validation message.
   * @apiError (Payment Required (402)) {string} [validation.value] Value sent in parameter.
   * @apiError (Payment Required (402)) {boolean} status Authentication status <code>false</code>.
   * @apiError (Not Found (404)) {boolean} status Consulta sem retorno <code>false</code>.
   *
   * @apiSuccessExample {json} Accepted (202)
   *  {
   *    "data": {
   *      "command": "DELETE",
   *      "rows": 0
   *    },
   *    "status": true,
   *    "timestamp": 0
   *  }
   *
   * @apiErrorExample {json} Unauthorized (401)
   *  {
   *    "validation": [{
   *      localtion: "",
   *      msg: "Unauthorized"
   *    }],
   *    "status": false
   *  }
   *
   * @apiErrorExample {json} Payment Required (402)
   *  {
   *    "validation": [
   *      {
   *        "location": "",
   *        "param": "",
   *        "msg": "",
   *        "value": ""
   *      }
   *    ],
   *    "status": false
   *  }
   *
   * @apiErrorExample {json} Not Found (404)
   *  {
   *    "status": false
   *  }
   */
  function deleteUser(req, res, next) {
    req.checkParams('id')
      .notEmpty()
      .withMessage('ID is required')
      .isInt({ min: 1 })
      .withMessage('ID must be Int type');

    req.getValidationResult()
      .then((erros) => {
        if (!erros.isEmpty()) Handlers.validation(req, res, erros.array());
        else {
          req.sanitize('id').toInt();

          UserModel.deleteUser(req.params.id)
            .then((data) => {
              if (data.rows === 0) Handlers.error(req, res);
              else Handlers.success(req, res, data, httpstatus.ACCEPTED);
            })
            .catch(exception => next(exception));
        }
      })
      .catch(exception => next(exception));
  }

  const router = Router();
  router.get('/', getUsers);
  router.get('/:id', getUser);
  router.post('/', postUser);
  router.put('/:id', putUser);
  router.delete('/:id', deleteUser);

  return router;
};
