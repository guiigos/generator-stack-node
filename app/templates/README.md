# <%= name %>

[![SasAS](https://img.shields.io/badge/GuiigOs-generator--stack--node-ff69b4.svg?style=flat-square)](https://github.com/guiigos/generator-stack-node)

> Base project for API developments in **NodeJs**.
> - [Usage](#usage)
>   - [Environment](#environment)
>   - [Dependencies](#dependencies)
>   - [Run](#run)
>   - [Tests](#tests)
> - [Database](#database)

## Usage
### Environment
Installation
```bash
$ npm install npm -g
```

### Dependencies
Install dependencies and modules
```bash
$ npm install
```

### Run
Compile project
```bash
# commands
$ gulp
$ gulp --tasks

# production
$ npm run start:pro
$ gulp pro

# homologation
$ npm run start:dev
$ gulp dev

# build
$ npm start
```

### Tests
```bash
# lint
# use the EsLint
$ npm run test:lint

# tdd
# use the chai and mocha
$ npm run test:tdd
$ npm run test:tdd:watch

# coverage
# use the nyc
$ npm run test:coverage

# all tests
$ npm test
```

## Database
```sql
CREATE TABLE users
(
	id SERIAL PRIMARY KEY,
	name TEXT,
	username TEXT,
	password TEXT,
	email TEXT,
	admin BOOLEAN
);
```
