import jwt from 'jsonwebtoken';
import Handlers from '../responses/handlers';
import { AccountModel } from '../../models/user.model';

export default (config) => {
  /**
   * @apiGroup Access
   * @api {post} /token Request authentication token
   * @apiDescription Token is used to access other API routes.
   *
   * @apiExample {js} HTTP
   *  var request = require("request");
   *
   *  var options = {
   *    method: 'POST',
   *    url: '[url]/token',
   *    headers: {
   *      'content-type': 'application/x-www-form-urlencoded'
   *    },
   *    form: {
   *      user: '',
   *      password: ''
   *    }
   *  };
   *
   *  request(options, function (error, response, body) {
   *    if (error) throw new Error(error);
   *
   *    console.log(body);
   *  });
   *
   * @apiParam {String} username Authentication user.
   * @apiParam {String} password Authentication password.
   *
   * @apiSampleRequest /token
   *
   * @apiSuccess (Success (200)) {String} token Access token.
   * @apiSuccess (Success (200)) {boolean} status Authentication status <code>true</code>.
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
   *    "token": "",
   *    "status": true
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
  function auth(req, res, next) {
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    req.getValidationResult()
      .then((erros) => {
        if (!erros.isEmpty()) Handlers.validation(req, res, erros.array());
        else {
          req.sanitize('username').trim();
          req.sanitize('password').trim();
          req.sanitize('password').crypto();

          AccountModel.validAccess(req.body.username, req.body.password)
            .then((payload) => {
              if (payload) {
                const options = { expiresIn: config.expire };

                jwt.sign(payload, config.secret, options, (error, token) => {
                  if (error) throw error;
                  else Handlers.authSuccess(req, res, token);
                });
              } else Handlers.authFail(req, res);
            })
            .catch(exception => next(exception));
        }
      })
      .catch(exception => next(exception));
  }

  return auth;
};
