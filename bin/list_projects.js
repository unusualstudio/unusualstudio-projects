const yaml = require('js-yaml');
const chokidar = require('chokidar');
const clear = require('clear');
const fs = require('mz/fs');
const path = require('path');

const projectStore = new Map();
let live = false;

const collator = new Intl.Collator('en');

function cfmn(f, compare) {
  return (m, n) => compare(f(m), f(n));
}

function writeList() {
  const entries = Array.from(projectStore.entries())
    .sort(cfmn(x => x[1].name || x[1].concept, collator.compare));
  if (live) clear();
  for (let [id, {name, concept}] of entries) {
    console.log(`${id} ${name || concept}`);
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
