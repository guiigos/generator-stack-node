import httpstatus from 'http-status';
import colors from 'colors';
import debug from 'debug';
import auth from './auth/auth';
import users from './exposed/users';

function constructAuth(app) {
  app.route('/token').post(auth(app.get('config').token));
}

function constructDefaults(app, raven) {
  // page not found
  app.use((req, res, next) => {
    res.status(httpstatus.NOT_FOUND).send('Page not found!');
    next();
  });

  // error sentry
  app.use(raven.errorHandler());

  // error default
  app.use((err, req, res, next) => {
    const status = err.status || httpstatus.INTERNAL_SERVER_ERROR;
    if (status === httpstatus.UNAUTHORIZED) {
      res.status(status).send({
        validation: [{
          location: 'Routes',
          msg: 'Unauthorized',
        }],
        status: false,
      });
    } else {
      debug('debug:server')(colors.red(err.message));
      debug('debug:server')(err);
      res.status(status).send(`Unidentified error, check Sentry: ${res.sentry}`);
    }
    next();
  });
}

function initRoutes(app, passport, raven, url) {
  app.use(`${url}/user`, passport.authenticate(), users());

  constructAuth(app);
  constructDefaults(app, raven);
}

export default initRoutes;
