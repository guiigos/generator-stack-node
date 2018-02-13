'use strict';

process.env.NODE_ENV = 'test';
const config = require('../../src/api/config/config')();

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
global.chai = chai;
global.config = config.database;
