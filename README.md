# unusualstudio-projects

All the projects I'm interested in pursuing on Unusual Studio.

## Schema / Layout

All projects are listed as YAML files in the `projects` directory.

The filename for each project is a UUID that will be used to describe that project for the lifetime of that project, plus the ".yaml" suffix.

Quantifying the "lifetime" of a project entails some [philosophical questions](https://en.wikipedia.org/wiki/Ship_of_Theseus): whether a significant change in the nature of a project results in a "different project" will have to be collectively resolved on a case-by-case basis.

### name

The current working title for this project.

### formerly

A list of any names this project may have gone by in the past.

### description

A short logline / pitch for the project, phrased as how it would be described following the words "(Name) is..." (eg. "A browser extension for stashing away groups of unused tabs" for Tabalanche).

### stage

Which "stage" the project is at, as a number from 0 to (currently) 3:

0, "Seed": The project is just an idea. It may not even have a name.

1, "Incubating": The project has a name and resources (such as a domain name) secured. It may have some development, but not enough to be usable.

2, "Viable": The project is, at least in part, usable, but is not fully developed or polished.

3, "Polished": The project looks and works as it should.

These correspond to the four leftmost lists in the Trello board where I had previously been tracking my projects: the other two, "Limbo" and "Forgotten", will either be represented as -1 and -2 (respectively), or not included in this repository.

Understanding [how I generally approach projects](https://github.com/stuartpb/how-i-roll/blob/master/starting/apps.md) may be helpful in understanding the progression from stage 0 to stage 1.

### status

A brief Markdown description of what's been done and what would be next.

### urls.logo

The URL of an image to represent this project.

### urls.home

The URL for the live home for this project.

### urls.info

The URL for something that can explain this project better than the current description.

Ideally, the project would have a homepage that should explain it adequately, but for smaller / less polished projects, this can fit that purpose. (For projects that have an adequate explanation of themselves on their homepage, this URL should not be present.)

### urls.repo

A URL that points to the development portal for this project.

Not necessarily an actual repo: for larger projects, this will point to the organization page.

### urls.news

A URL pointing to a changelog / news feed for this project (what's already been done)

### urls.todo

A URL pointing to a roadmap / "what needs to be done" page for this project.

### dex

A magic number that ranks certain projects, in lieu of a proper ranking system. Higher numbers go higher to the top. (The planned scale is to be something like 0-30, but, since it's all completely arbitrary, I don't have to follow that.)
