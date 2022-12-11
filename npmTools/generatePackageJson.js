const fs = require('fs');

const { readFileSync, writeFileSync } = fs;

const packageProject = JSON.parse(readFileSync('./package.json'));
const packageNPM = JSON.parse(readFileSync('npmTools/npm.package.json'));

packageNPM.name = packageProject.name;
packageNPM.description = packageProject.description;
packageNPM.author = packageProject.author;
packageNPM.keywords = packageProject.keywords;
packageNPM.version = packageProject.version;
packageNPM.private = packageProject.private;
packageNPM.license = packageProject.license;

const ordered = Object.keys(packageNPM)
  .sort()
  .reduce((obj, key) => {
    obj[key] = packageNPM[key];
    return obj;
  }, {});

writeFileSync('dist/package.json', JSON.stringify(ordered), { encoding: 'utf8' });
