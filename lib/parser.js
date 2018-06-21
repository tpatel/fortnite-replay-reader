const Parser = require("binary-parser").Parser;

const Header = new Parser()
  .endianess('little')
  .int32('unknown1')
  .int32('unknown2')
  .int32('unknown3')
  .int32('unknown4')
  .int32('version')
  .int32('name_length')
  .string('name', { encoding: 'ascii', length: 'name_length', stripNull: true })
  .skip(54)
  .int32('game_length')
  .string('game', { encoding: 'ascii', length: 'game_length', stripNull: true })
  .skip(4)
  .int32('map_length')
  .string('map', { encoding: 'ascii', length: 'map_length', stripNull: true })

  ;

const ReplayParser = new Parser()
  .endianess("little")
  .nest("header", {type: Header})

module.exports = ReplayParser;