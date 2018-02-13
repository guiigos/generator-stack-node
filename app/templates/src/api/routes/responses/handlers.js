import httpstatus from 'http-status';

class Handlers {
  static validation(req, res, erros, status = httpstatus.PAYMENT_REQUIRED) {
    res.status(status).send({
      validation: erros,
      status: false,
    });
  }

  static success(req, res, data, status = httpstatus.OK) {
    res.status(status).send({
      data,
      status: true,
      timestamp: new Date().getTime(),
    });
  }

  static error(req, res, status = httpstatus.NOT_FOUND) {
    res.status(status).send({
      status: false,
    });
  }

  static authSuccess(req, res, token) {
    res.status(httpstatus.OK).send({
      token,
      status: true,
    });
  }

  static authFail(req, res) {
    res.status(httpstatus.UNAUTHORIZED).send({
      validation: [{
        location: 'Handlers',
        msg: 'Unauthorized',
      }],
      status: false,
    });
  }
}

export default Handlers;
