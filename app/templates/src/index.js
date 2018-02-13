import http from 'http';
import figlet from 'figlet';
import colors from 'colors';
import debug from 'debug';

import app from './api/app';

// debug
debug('debug:server')('Starting application');

// porta
const port = process.env.PORT || app.get('config').server.port;

// servidor
const server = http.createServer(app);
server.listen(port);

// error
server.on('error', (error) => {
  debug('debug:server')(`An error has occurred: ${error.message}`);
  throw error;
});

// listening
server.on('listening', () => {
  figlet.text('<%= name %>', (error, data) => {
    if (!error && debug('debug:server').enabled) {
      /* eslint-disable no-console */
      console.log(colors.red(data));
      /* eslint-enable no-console */
    }

    const addr = server.address();
    debug('debug:server')(colors.yellow(`Server running ${(typeof addr === 'string') ? `at address ${addr}` : `at ${addr.port}`}`));
  });
});
