const argv = require('minimist')(process.argv.slice(2));
const yaml = require('js-yaml');
const chokidar = require('chokidar');
const clear = require('clear');
const chalk = require('chalk');
const fs = require('mz/fs');
const path = require('path');
require('es7-shim').shim();

const watchMode = argv.watch || argv.w;

if (argv.rank) {
  argv.dex = true;
  argv.sort = 'dex';
}

const projectStore = new Map();
let live = false;

const collator = new Intl.Collator('en');

function cfmn(f, compare) {
  return (m, n) => compare(f(m), f(n));
}

const descending = (m, n) => m > n ? -1 : m < n ? 1 : 0;

const collation = cfmn(x => x[1].name || x[1].concept, collator.compare);
const initiative = cfmn(x => x[1].dex, descending);

function writeList() {
  const entries = Array.from(projectStore.entries())
    .sort(argv.sort == 'dex' ? initiative : collation);

  const maxDex = entries.reduce(
    (a, c) => Math.max(a, c[1].dex || 0), entries[0][1].dex || 0);
  const maxDexDigits = maxDex.toFixed(0).length;

  if (live) clear();
  for (let [id, {name, dex, concept}] of entries) {
    console.log(`${argv.paths ? `/projects/${id}.yaml` : id} ${argv.dex ?
      (dex.toFixed(0).padStart(maxDexDigits) + ' ') : ''}${name ?
      chalk.yellowBright(name) : chalk.greenBright(concept)}`);
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
  if (watchMode) {
    live = true;
    writeList();
    chokidar.watch('projects', {ignoreInitial: true})
      .on('add', updateProjectFromFile)
      .on('change', updateProjectFromFile)
      .on('unlink', deleteProjectByFile);
  } else writeList();
});
