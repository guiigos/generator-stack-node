import debug from 'debug';
import cryptojs from 'crypto-js';

export default {
  crypto: (value) => {
    try {
      return cryptojs.MD5(value).toString();
    } catch (erro) {
      debug('debug:server')(erro);
      return value;
    }
  },
};
