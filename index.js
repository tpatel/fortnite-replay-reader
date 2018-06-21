const fs = require('fs');
const parser = require('./lib/parser.js');

const file = './data/test3.replay'

const buffer = fs.readFileSync(file);

var data = parser.parse(buffer);

console.log(JSON.stringify(data.header, null, 2));