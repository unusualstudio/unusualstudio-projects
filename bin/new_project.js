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
  {name: 'status'},
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

function indented(prefix, str) {
  return prefix + str.replace(/\n/g, '\n' + prefix);
}

function projectYaml(project) {
  const lineBuffer = [];

  if (project.name !== undefined)
    lineBuffer.push(`name: ${project.name}`);

  if (project.concept !== undefined)
    lineBuffer.push(`concept: ${project.concept}`);

  if (project.description !== undefined)
    lineBuffer.push(`description: ${yaml.dump(project.description).trim()}`);

  if (project.stage !== undefined)
    lineBuffer.push(`stage: ${project.stage}`);

  if (project.status !== undefined)
    lineBuffer.push(`status: >-\n${indented('  ', project.status)}`);

  if (project.urls !== undefined) {
    lineBuffer.push('urls:');
    for (let key of Object.keys(project.urls)) {
      lineBuffer.push(`  ${key}: ${project.urls[key]}`);
    }
  }

  if (project.dex !== undefined)
    lineBuffer.push(`dex: ${project.dex}`);

  return lineBuffer.join('\n') + '\n';
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
