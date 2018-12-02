const fs = require('fs');
const parser = require('./lib/parser.js');

const file = './data/UnsavedReplay-2018.07.15-23.26.39.replay';

const buffer = fs.readFileSync(file);

var data = parser.parse(buffer);

// Use the data to output the whole parsed object
console.log(JSON.stringify(data, null, 2));

// Use the data to output the kills
console.log(
  data.chunks
    .filter((c) => c.res && c.res.group == 'playerElim')
    .map((c) => {
      c.res.res.time = c.res.time1;
      return c.res.res;
    })
    .map((c) => `${require('./lib/utils').msToInterval(c.time)}  [${c.killer}] eliminated [${c.killed}] [${c.type}]`)
    .join('\n')
);