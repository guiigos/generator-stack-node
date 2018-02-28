/*
* standard development environment: env[0] development
*/

const env = [
  'development',
  'production',
  'test',
];

process.env.NODE_ENV = process.env.NODE_ENV || env[0];
process.env.NODE_ENV = process.env.NODE_ENV.trim();
process.env.NODE_ENV = (env.indexOf(process.env.NODE_ENV) > -1) ? process.env.NODE_ENV : env[0];
module.exports = () => require(`./env/${process.env.NODE_ENV}.env`);
