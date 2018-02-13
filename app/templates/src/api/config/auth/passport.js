import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AccountModel } from '../../models/user.model';

export default (secret) => {
  const jwtOptions = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  passport.use(new Strategy(jwtOptions, (payload, next) => {
    if (Object.prototype.hasOwnProperty.call(payload, 'id') &&
      Object.prototype.hasOwnProperty.call(payload, 'name') &&
      Object.prototype.hasOwnProperty.call(payload, 'username')) {
      AccountModel.validToken(payload)
        .then((data) => {
          if (data) next(null, payload);
          else next(null, false);
        })
        .catch(error => next(error));
    } else next(null, false);
  }));

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', {
      session: false,
      failWithError: true,
    }),
  };
};
