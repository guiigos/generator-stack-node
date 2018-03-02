'use strict';

let yeoman = require('yeoman-generator');
let accents = require('remove-accents');
let figlet = require('figlet');
let yosay = require('yosay');
let path = require('path');
let chalk = require('chalk');

const desc = {
  name: 'What is the project name?',
  email: 'What is the email of the author of this project?',
  author: 'Who is the author of this project?',
  homepage: 'What is the project homepage?',
  description: 'What is a short description for this project?',
  dbuser: 'What is the connection user with postgres?',
  dbpassword: 'What is the access password for connection to postgres?',
  dbhost: 'What is the host of the database?',
  dbport: 'What is the database port?',
  sentry: 'If you have report sentry DNS to monitor errors in production.'
};

module.exports = class extends yeoman {

  constructor(args, opts) {
    super(args, opts);

    // set data from package.json
    let pkg = this.fs.readJSON(path.join(this.sourceRoot(), '../..', 'package.json'), {
      author: {
        name: '',
        email: ''
      },
      homepage: ''
    });

    // parameters
    this.params = {
      name: this.appname,
      folder: accents.remove(this.appname || '').trim().toLowerCase().replace(/ /g, '-'),
      author: pkg.author.name,
      description: undefined,
      email: pkg.author.email,
      homepage: pkg.homepage,
      dbuser: 'postgres',
      dbpassword: undefined,
      dbhost: 'localhost',
      dbport: 5432,
      sentry: undefined
    };

    // options
    this.option('name', {
      alias: 'n',
      type: String,
      default: undefined,
      description: desc.name,
    });

    this.option('description', {
      alias: 'd',
      type: String,
      default: undefined,
      description: desc.description,
    });

    this.option('author', {
      alias: 'a',
      type: String,
      default: undefined,
      description: desc.author,
    });

    this.option('email', {
      alias: 'e',
      type: String,
      default: undefined,
      description: desc.email,
    });

    this.option('homepage', {
      alias: 'h',
      type: String,
      default: undefined,
      description: desc.homepage,
    });

    this.option('dbuser', {
      alias: 'dbu',
      type: String,
      default: undefined,
      description: desc.dbuser,
    });

    this.option('dbpassword', {
      alias: 'dbp',
      type: String,
      default: undefined,
      description: desc.dbpassword,
    });

    this.option('dbhost', {
      alias: 'dbh',
      type: String,
      default: undefined,
      description: desc.dbhost,
    });

    this.option('dbport', {
      alias: 'dbp',
      type: String,
      default: undefined,
      description: desc.dbport,
    });

    this.option('sentry', {
      alias: 's',
      type: String,
      default: undefined,
      description: desc.sentry,
    });
  }

  initializing() {
    if (!this.fs.exists(this.templatePath('package/package.json'))) {
      this.log(`Dependency ${chalk.yellow('stack-node-dependency')} not found.`);
      process.exit();
    }

    this.log(yosay(`Hello, welcome to the generator of ${chalk.yellow('NodeJs API')} development environments.\n\n${this.params.author}\n${this.params.email}\n${this.params.homepage}`));
  }

  prompting() {
    let params = [];

    if (!this.options['name'] || this.options['name'].trim().length == 0) {
      params.push({
        type: 'input',
        name: 'name',
        store: false,
        message: desc.name,
        default: this.params.name
      });
    } else {
      this.params.name = this.options['name'];
      this.params.folder = accents.remove(this.options['name'] || '').trim().toLowerCase().replace(/ /g, '-');
    }

    if (!this.options['description'] || this.options['description'].trim().length == 0) {
      params.push({
        type: 'input',
        name: 'description',
        store: false,
        message: desc.description,
        default: this.params.description
      });
    } else this.params.description = this.options['description'];

    if (!this.options['author'] || this.options['author'].trim().length == 0) {
      params.push({
        type: 'input',
        name: 'author',
        store: false,
        message: desc.author,
        default: this.params.author
      });
    } else this.params.author = this.options['author'];

    if (!this.options['email'] || this.options['email'].trim().length == 0) {
      params.push({
        type: 'input',
        name: 'email',
        store: false,
        message: desc.email,
        default: this.params.email
      });
    } else this.params.email = this.options['email'];

    if (!this.options['homepage'] || this.options['homepage'].trim().length == 0) {
      params.push({
        type: 'input',
        name: 'homepage',
        store: false,
        message: desc.homepage,
        default: this.params.homepage
      });
    } else this.params.homepage = this.options['homepage'];

    if (!this.options['dbuser'] || this.options['dbuser'].trim().length == 0) {
      params.push({
        type: 'input',
        name: 'dbuser',
        store: false,
        message: desc.dbuser,
        default: this.params.dbuser
      });
    } else this.params.dbuser = this.options['dbuser'];

    if (!this.options['dbpassword'] || this.options['dbpassword'].trim().length == 0) {
      params.push({
        type: 'input',
        name: 'dbpassword',
        store: false,
        message: desc.dbpassword,
        default: this.params.dbpassword
      });
    } else this.params.dbpassword = this.options['dbpassword'];

    if (!this.options['dbhost'] || this.options['dbhost'].trim().length == 0) {
      params.push({
        type: 'input',
        name: 'dbhost',
        store: false,
        message: desc.dbhost,
        default: this.params.dbhost
      });
    } else this.params.dbhost = this.options['dbhost'];

    if (!this.options['dbport'] || this.options['dbport'].trim().length == 0) {
      params.push({
        type: 'input',
        name: 'dbport',
        store: false,
        message: desc.dbport,
        default: this.params.dbport
      });
    } else this.params.dbport = this.options['dbport'];

    if (!this.options['sentry'] || this.options['sentry'].trim().length == 0) {
      params.push({
        type: 'input',
        name: 'sentry',
        store: false,
        message: desc.sentry,
        default: this.params.sentry
      });
    } else this.params.sentry = this.options['sentry'];

    return this.prompt(params)
      .then((answers) => {
        if (answers.name) {
          this.params.name = answers.name;
          this.params.folder = accents.remove(answers.name || '').trim().toLowerCase().replace(/ /g, '-');
        }
        if (answers.description) this.params.description = answers.description;
        if (answers.author) this.params.author = answers.author;
        if (answers.email) this.params.email = answers.email;
        if (answers.homepage) this.params.homepage = answers.homepage;
        if (answers.dbuser) this.params.dbuser = answers.dbuser;
        if (answers.dbpassword) this.params.dbpassword = answers.dbpassword;
        if (answers.dbhost) this.params.dbhost = answers.dbhost;
        if (answers.dbport) this.params.dbport = answers.dbport;
        if (answers.sentry) this.params.sentry = answers.sentry;
      });
  }

  configuring() {
    this.destinationRoot(this.params.folder);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package', 'package.json'),
      this.destinationPath('package.json'),
      this.params
    );

    this.fs.copyTpl(
      this.templatePath('src', '**', '*'),
      this.destinationPath('src'),
      this.params
    );

    this.fs.copyTpl(
      this.templatePath('test', '**', '*'),
      this.destinationPath('test'),
      this.params
    );

    this.fs.copy(
      this.templatePath('util', 'editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copy(
      this.templatePath('util', 'gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copyTpl(
      this.templatePath(`*`),
      this.destinationPath(),
      this.params,
      {
        globOptions: {
          dot: true
        }
      }
    );
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false,
      skipInstall: this.options['skip-install']
    });
  }

  end() {
    figlet.text('GuiigOs', (error, data) => {
      this.log(chalk.yellow(data));
    });
  }
};
