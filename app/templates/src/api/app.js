import expressValidator from 'express-validator';
import compression from 'compression';
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import raven from 'raven';
import debug from 'debug';
import cors from 'cors';
import path from 'path';
import sanitizers from './config/validator/sanitizers';
import database from './config/db/database';
import passport from './config/auth/passport';
import routes from './routes/routes';

// settings
const CONFIG = require('./config/config')();

raven.config(CONFIG.sentry.dns || '').install();

// authentication
const token = passport(CONFIG.token.secret);

// database
global.db = global.db || database(CONFIG.database).connect();

// server
const app = express();
app.set('config', CONFIG);

app.use(morgan('dev', { stream: { write: log => debug('debug:server')(log) } }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(token.initialize());
app.use(raven.requestHandler());
app.use(expressValidator({ customSanitizers: sanitizers }));
app.use(compression());
app.use(cors());

// documentation
app.use(express.static(path.join(__dirname, '/../doc')));

// routers
routes(app, token, raven, '/api/v1');

export default app;
