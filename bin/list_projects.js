const yaml = require('js-yaml');
const chokidar = require('chokidar');
const clear = require('clear');
const fs = require('mz/fs');
const path = require('path');

const projectStore = new Map();
let live = false;

const collator = new Intl.Collator('en');

function writeList() {
  const entries = Array.from(projectStore.entries())
    .sort((m, n) => collator.compare(m[1].name, n[1].name));
  if (live) clear();
  for (let [id, {name}] of entries) {
    console.log(`${id} ${name}`);
  }
}

function updateProjectFromFile(filename) {
  const id = path.basename(filename).replace(/\.yaml$/,'');
  return fs.readFile(filename)
    .then(data => {
      projectStore.set(id, yaml.load(data));
      if (live) writeList();
    });
}

function deleteProjectByFile(filename) {
  const id = path.basename(filename).replace(/\.yaml$/,'');
  projectStore.delete(id);
  if (live) writeList();
}

fs.readdir('projects').then(names =>
  Promise.all(names.map(name =>
    fs.readFile(path.join('projects',name)).then(data =>
      [name.replace(/\.yaml$/,''), yaml.load(data)])))
).then(projectData =>{
  for (let [id, data] of projectData) projectStore.set(id, data);
}).then(()=>{
  live = true;
  writeList();
  chokidar.watch('projects', {ignoreInitial: true})
    .on('add', updateProjectFromFile)
    .on('change', updateProjectFromFile)
    .on('unlink', deleteProjectByFile);
});
