# Generator Stack NodeJs
[![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies Status][david-dm-image]][david-dm-url] [![DevDependencies Status][david-dm-dev-image]][david-dm-dev-url] 

[![NPM][npm-image]][npm-url]

[travis-image]: https://img.shields.io/travis/guiigos/generator-stack-node/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/guiigos/generator-stack-node
[coveralls-image]: https://img.shields.io/coveralls/github/guiigos/generator-stack-node/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/guiigos/generator-stack-node?branch=master
[david-dm-image]: https://david-dm.org/guiigos/generator-stack-node/status.svg?style=flat-square
[david-dm-url]: https://david-dm.org/guiigos/generator-stack-node
[david-dm-dev-image]: https://david-dm.org/guiigos/generator-stack-node/dev-status.svg?style=flat-square
[david-dm-dev-url]: https://david-dm.org/guiigos/generator-stack-node?type=dev
[npm-image]: https://nodei.co/npm/generator-stack-node.png?downloads=true&downloadRank=true&stars=true
[npm-url]: https://nodei.co/npm/generator-stack-node

> Stack boilerplate personal from API **NodeJs**.<br>
> - [Overview](#overview)
>   - [Generated Project Dependencies](#generated-project-dependencies)
> - [Installation](#installation)
> - [Usage](#usage)
>   - [Options](#options)
> - [Directory](#directory)
> - [Generator Development](#generator-development)
>   - [Run](#run)
>   - [Tests](#tests)
> - [Authors](#authors)
> - [License](#license)

## Overview
Generator using [Yeoman](http://yeoman.io).<br>

The generator creates an express API model compiling the code with [Babel](https://babeljs.io/), comes with integration with [PostgreSql](https://github.com/brianc/node-postgres) database, token authentication with [Passport](https://github.com/jaredhanson/passport) using [JWT](https://github.com/themikenicholson/passport-jwt) and possibility of reporting errors by [Sentry](https://sentry.io/). It has a documentation generator using [apiDoc](http://apidocjs.com/). Contains lint tests using [esLint](https://eslint.org/), TDD tests using [Mocha](https://github.com/mochajs/mocha) and code coverage using [nyc](https://github.com/istanbuljs/nyc).

### Generated Project Dependencies
[![Dependencies Status][david-dm-dep-image]][david-dm-dep-url] [![DevDependencies Status][david-dm-dep-dev-image]][david-dm-dep-dev-url]

[david-dm-dep-image]: https://david-dm.org/guiigos/stack-node-dependency/status.svg?style=flat-square
[david-dm-dep-url]: https://david-dm.org/guiigos/stack-node-dependency
[david-dm-dep-dev-image]: https://david-dm.org/guiigos/stack-node-dependency/dev-status.svg?style=flat-square
[david-dm-dep-dev-url]: https://david-dm.org/guiigos/generator-stack-node?type=dev


## Installation
Commands to install the tools to run the generator.

```bash
# tools
$ npm install npm -g
$ npm install yo -g

# generator
$ npm install -g generator-stack-node
```

## Usage
Commands to run the generator.

```bash
$ yo stack-node <options>
```

### Options
The options that are not informed will be requested by the generator when initiating project.

```bash
  -h,   --help          # Print the generator's options and usage
        --skip-cache    # Do not remember prompt answers                    Default: false
        --skip-install  # Do not automatically install dependencies         Default: false
  -n,   --name          # What is the project name?
  -d,   --description   # What is a short description for this project?
  -a,   --author        # Who is the author of this project?
  -e,   --email         # What is the email of the author of this project?
  -h,   --homepage      # What is the project homepage?
```

## Directory
```bash
|-- name-project                                 # Project name
    |-- .editorconfig                            # Maintain consistent coding styles
    |-- .gitignore                               # Contains files to be ignored when pushing to git
    |-- gulpfile.js                              # Link all splittered gulp tasks
    |-- package.json                             # Holds various metadata relevant to the project
    |-- README.md                                # Contains the details of the generated project
    |-- src                                      # The source code of the application
    |   |-- index.js                             # Application main file
    |   |-- api                                  # Main project folder
    |       |-- app.js                           # Module that starts the server
    |       |-- config                           # General settings folder
    |       |   |-- config.js                    # File that loads the settings according to the environment
    |       |   |-- auth                         # Authentication settings folder
    |       |   |   |-- passport.js              # Authentication configuration module using passport
    |       |   |-- db                           # Database module folder
    |       |   |   |-- database.js              # PostgreSql database module
    |       |   |-- env                          # Project settings folder
    |       |   |   |-- development.env          # Development environment settings
    |       |   |   |-- production.env           # Production environment settings
    |       |   |   |-- test.env                 # Test environment settings
    |       |   |-- validator                    # Express validation folder
    |       |       |-- sanitizers.js            # Sanitizers of express
    |       |-- models                           # Templates folder
    |       |   |-- user.model.js                # User model manipulation of data with the database
    |       |-- routes                           # Application routes
    |           |-- routes.js                    # Standard and custom route file
    |           |-- auth                         # Authentication routes folder
    |           |   |-- auth.js                  # Token request route
    |           |-- exposed                      # Folder of other routes
    |           |   |-- users.js                 # User registration routes
    |           |-- responses                    # Responses definitions folder
    |               |-- handlers.js              # Standard responses to requests
    |-- test                                     # The source code of the tests
        |-- mocha.opts                           # Mocha options and parameters
        |-- data                                 # Fictitious data folder
        |   |-- user.json                        # User registration data
        |-- integration                          # Integration testing folder
        |   |-- index.spec.js                    # Main integration testing file
        |   |-- modules                          # Integration test modules
        |       |-- authentication.spec.js       # Authentication test file
        |       |-- routes.spec.js               # Standard route test file
        |       |-- user.spec.js                 # User test file
        |-- loader                               # Folder files that are required by the tests
        |   |-- globals.js                       # Loads modules and global settings
        |-- unitary                              # Unitary testing folder
            |-- index.spec.js                    # Main unitary testing file
            |-- modules                          # Unitary test modules
                |-- authentication.spec.js       # Authentication test file
                |-- database.spec.js             # Database connection test file
                |-- user.spec.js                 # User test file
```

## Generator Development
Procedures in the development of the generator.

### Run
Run project in development mode.

```bash
# start submodules
$ git submodule init

# populating the submodule
$ git submodule update

# link package npm
$ npm link

# create a tarball from a package
$ npm pack

# run generator
$ yo stack-node <options>
```

### Tests
Run test to ensure generator functionality.

```bash
$ npm test
```

## Authors
| ![Guilherme Alves](https://avatars2.githubusercontent.com/u/6471538?v=3&s=150)|
|:---------------------:|
|  [Guilherme Alves](https://github.com/guiigos)   |

## License
[![License MIT](https://img.shields.io/github/license/guiigos/generator-stack-node.svg?style=flat-square)](https://github.com/guiigos/generator-stack-node/blob/master/LICENSE)
