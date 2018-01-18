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
  console.log(`total ${projectStore.size}`);
}

function updateProjectFromFile(filename) {
  const id = path.basename(filename).replace(/\.yaml$/,'');
  return fs.readFile(filename).then(data => {
    projectStore.set(id, yaml.load(data));
    if (live) writeList();
  });
}

function deleteProjectByFile(filename) {
  const id = path.basename(filename).replace(/\.yaml$/,'');
  projectStore.delete(id);
  if (live) writeList();
}

fs.readdir('projects').then(names => Promise.all(
  names.map(name => updateProjectFromFile(path.join('projects', name))))
).then(() => {
  live = true;
  writeList();
  chokidar.watch('projects', {ignoreInitial: true})
    .on('add', updateProjectFromFile)
    .on('change', updateProjectFromFile)
    .on('unlink', deleteProjectByFile);
});
