const inquirer = require('inquirer');
const yaml = require('js-yaml');
const uuid = require('uuid/v4');
const fs = require('mz/fs');

const prompts = [
  {name: 'name'},
  {name: 'description'},
  {name: 'stage', type: 'list', choices: [
    {name: '0 (Seed)', value: 0},
    {name: '1 (Incubating)', value: 1},
    {name: '2 (Viable)', value: 2},
    {name: '3 (Polished)', value: 3}
  ]},
  {name: 'status'},
  {name: 'logo'},
  {name: 'homepage'},
  {name: 'repository'},
  {name: 'initiative'}
// until https://github.com/SBoudrias/Inquirer.js/pull/636 is merged
].map(q=>{if (!q.message) q.message = q.name + ':'; return q});

inquirer.prompt(prompts).then(project => {
  for (let key of Object.keys(project)) {
    if (project[key] === '') delete project[key];
  }
  if (project.initiative !== undefined) {
    project.initiative = parseFloat(project.initiative);
  }
  const id = uuid();
  fs.writeFileSync(`projects/${id}.yaml`, yaml.dump(project), 'utf8');
  console.log(id);
});
