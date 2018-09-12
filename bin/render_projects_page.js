const argv = require('minimist')(process.argv.slice(2));
const yaml = require('js-yaml');
const pug = require('pug');
const marked = require('marked');
const fs = require('mz/fs');
const path = require('path');

function cfmn(f, compare) {
  return (m, n) => compare(f(m), f(n));
}

const descending = (m, n) => m > n ? -1 : m < n ? 1 : 0;

const initiative = cfmn(x => x.dex, descending);

function projectFromFilename(filename) {
  const id = path.basename(filename).replace(/\.yaml$/,'');
  return fs.readFile(filename).then(data => {
    const project = yaml.load(data);
    project.id = id;
    if (project.description) {
      project.description = marked(project.description).trim();
    }
    if (project.remarks) {
      project.remarks = marked(project.remarks).trim();
    }
    return project;
  });
}

const destinationPagename = '../unusual.studio/projects/index.html';

fs.readdir('projects').then(names => Promise.all(
  names.map(name => projectFromFilename(path.join('projects', name))))
).then(projects => {
  projects = projects.sort(initiative);
  return fs.writeFile(destinationPagename,
    pug.renderFile(
      path.join(__dirname,'../templates/projects.pug'),
      {projects}));
}).catch(console.error);
