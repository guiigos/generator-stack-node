'use strict';

var path = require('path');
var glob = require("glob");
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var pjson = require('../package.json');

// directories
let pathApp = path.join(__dirname, '../app');
let pathTemp = path.join(__dirname, '../.temp');

// validations
let expected = [];
let project = {
  path: 'new-project-teste',
  name: 'New Project Teste',
  email: 'norman.hall@random.com',
  author: 'Norman Hall',
  homepage: 'www.norman.hall.me',
  description: 'Project to ensure the integrity of the scaffold'
};

describe('generator', () => {

  before((done) => {
    glob(`${pathApp}/templates/{package/package.json,src/**/*,test/**/*,util/*}`,
      {
        dot: true,
        nodir: true
      },
      (error, res) => {
        if (error) done(error);
        expected = res.map((element) => {
          element = element.replace('app/templates', `.temp/${project.path}`);
          element = element.replace('util/gitignore', '.gitignore');
          element = element.replace('util/editorconfig', '.editorconfig');
          element = element.replace('package/package.json', 'package.json');

          return element;
        });

        done();
      });
  });

  it('can be imported without blowing up', () => {
    let app = require('../app');
    assert(app !== undefined);
  });

  it('informing all parameters through options', (done) => {
    let param = Object.assign({}, project, {
      skipInstall: true
    });
    delete param.path;

    helpers.testDirectory(pathTemp, (error) => {
      if (error) done(error);

      helpers.run(pathApp)
        .inDir(pathTemp)
        .withOptions(param)
        .on('end', () => {
          assert.file(expected);
          assert.jsonFileContent(`${pathTemp}/${project.path}/package.json`, {
            name: project.path,
            description: project.description,
            homepage: project.homepage,
            author: {
              name: project.author,
              email: project.email
            },
            apidoc: {
              name: project.name,
              title: project.description
            }
          });
          assert.fileContent([
            [`${pathTemp}/${project.path}/README.md`, `# ${project.name}`],
            [`${pathTemp}/${project.path}/src/index.js`, `figlet.text('${project.name}'`]
          ]);
          done();
        });
    });
  });

  it('informing all the parameters through the prompt', (done) => {
    let param = Object.assign({}, project);
    delete param.path;

    helpers.testDirectory(pathTemp, (error) => {
      if(error) done(error);

      helpers.run(pathApp)
        .inDir(pathTemp)
        .withOptions({
          skipInstall: true
        })
        .withPrompts(param)
        .on('end', () => {
          assert.file(expected);
          assert.jsonFileContent(`${pathTemp}/${project.path}/package.json`, {
            name: project.path,
            description: project.description,
            homepage: project.homepage,
            author: {
              name: project.author,
              email: project.email
            },
            apidoc: {
              name: project.name,
              title: project.description
            }
          });
          assert.fileContent([
            [`${pathTemp}/${project.path}/README.md`, `# ${project.name}`],
            [`${pathTemp}/${project.path}/src/index.js`, `figlet.text('${project.name}'`]
          ]);
          done();
        });
    });
  });

  it('searching for the main parameters of the package.json file', (done) => {
    let param = Object.assign({}, project);
    delete param.path;
    delete param.email;
    delete param.author;
    delete param.homepage;

    helpers.testDirectory(pathTemp, (error) => {
      if(error) done(error);

      helpers.run(pathApp)
        .inDir(pathTemp)
        .withOptions({
          skipInstall: true
        })
        .withPrompts(param)
        .on('end', () => {
          assert.file(expected);
          assert.jsonFileContent(`${pathTemp}/${project.path}/package.json`, {
            name: project.path,
            description: project.description,
            homepage: pjson.homepage,
            author: {
              name: pjson.author.name,
              email: pjson.author.email
            },
            apidoc: {
              name: project.name,
              title: project.description
            }
          });
          assert.fileContent([
            [`${pathTemp}/${project.path}/README.md`, `# ${project.name}`],
            [`${pathTemp}/${project.path}/src/index.js`, `figlet.text('${project.name}'`]
          ]);
          done();
        });
    });
  });
});
