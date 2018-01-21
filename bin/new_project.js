const inquirer = require('inquirer');
const yaml = require('js-yaml');
const uuid = require('uuid/v4');
const fs = require('mz/fs');

const prompts = [
  {name: 'name'},
  {name: 'concept'},
  {name: 'description'},
  {name: 'stage', type: 'list', choices: [
    {name: '0 (Seed)', value: 0},
    {name: '1 (Incubating)', value: 1},
    {name: '2 (Viable)', value: 2},
    {name: '3 (Polished)', value: 3}
  ]},
  {name: 'remarks'},
  {name: 'urls.logo'},
  {name: 'urls.home'},
  {name: 'urls.info'},
  {name: 'urls.repo'},
  {name: 'urls.news'},
  {name: 'urls.todo'},
  {name: 'dex'}
// until https://github.com/SBoudrias/Inquirer.js/pull/636 is merged
].map(q=>{if (!q.message) q.message = q.name + ':'; return q});

function deleteEmptyStringProperties(obj) {
  for (let key of Object.keys(obj)) {
    if (obj[key] === '') delete obj[key];
  }
}

function projectYaml(project) {
  return yaml.dump(project, {lineWidth: 78});
}

inquirer.prompt(prompts).then(project => {
  deleteEmptyStringProperties(project);
  deleteEmptyStringProperties(project.urls);
  if (Object.keys(project.urls).length == 0) delete project.urls;
  if (project.dex !== undefined) {
    project.dex = parseFloat(project.dex);
  }
  const id = uuid();
  fs.writeFileSync(`projects/${id}.yaml`, projectYaml(project), 'utf8');
  console.log(`/projects/${id}.yaml`);
});
