const Parser = require('binary-parser').Parser;
const bignum = require('bignum');
const utils = require('./utils.js');

const ELocalFileChunkType = {
  0: 'Header',
  1: 'ReplayData',
  2: 'Checkpoint',
  3: 'Event',
  0xFFFFFFFF: 'Unknown'
};

const ReplayHeader = new Parser()
  .endianess('little')
  .int32('MagicNumber')
  .int32('FileVersion')
  .int32('LengthInMS')
  .int32('NetworkVersion')
  .int32('Changelist')
  .int32('FriendlyNameSize', {
    formatter: function(int) {
      return int < 0 ? -int*2 : int;
    }
  })
  .string('FriendlyName', {
    length: 'FriendlyNameSize',
    encoding: 'hex',
    stripNull: 'true',
    formatter: function(str) {
      if(/0000$/.test(str)) {
        return new Buffer(str, 'hex').toString('ucs2').replace(/\u0000$/, '');
      }
      return new Buffer(str, 'hex').toString('utf8');
    }
  })
  .int32('IsLive', {
    formatter: function(int) {
      return int != 0;
    }
  })
  .buffer('Timestamp', { length: 8 })
  .int32('Compressed', {
    formatter: function(int) {
      return int != 0;
    }
  });

//https://github.com/EpicGames/UnrealEngine/blob/master/Engine/Source/Runtime/NetworkReplayStreaming/LocalFileNetworkReplayStreaming/Private/LocalFileNetworkReplayStreaming.cpp#L211
const Chunk = new Parser()
  .endianess('little')
  .int32('ChunkType')
  .int32('SizeInBytes')
  .buffer('buffer', { length: 'SizeInBytes' });

const ReplayParser = new Parser()
  .endianess('little')
  .nest('header', {type: ReplayHeader})
  .array('chunks', {
    type: Chunk,
    readUntil: 'eof'
  })

const HeaderChunk = new Parser()
  .endianess('little')
  .skip(20)
  .int8('major')
  .skip(1)
  .int8('minor')
  .skip(1)
  .int8('patch')
  .skip(1)
  .int32('build')
  .int32('version_length')
  .string('version', { length: 'version_length', stripNull: 'true'})
  .int32('unknown1')
  .int32('map_length')
  .string('map', { length: 'map_length', stripNull: 'true'})
  .int32('unknow2')
  .int32('unknow3')
  .int32('unknow4')
  .buffer('buffer', { readUntil: 'eof'})

const ReplayDataChunk = new Parser()
  .endianess('little')
  .uint32('time1')
  .uint32('time2')
  .buffer('buffer', { readUntil: 'eof'})

const CheckpointChunk = new Parser()
  .endianess('little')
  .int32('id_length')
  .string('id', { length: 'id_length', stripNull: 'true'})
  .int32('group_length')
  .string('group', { length: 'group_length', stripNull: 'true'})
  .int32('metadata_length')
  .string('metadata', { length: 'metadata_length', stripNull: 'true'})
  .uint32('time1')
  .uint32('time2')
  .uint32('SizeInBytes')

const EventChunk = new Parser()
  .endianess('little')
  .int32('id_length')
  .string('id', { length: 'id_length', stripNull: 'true'})
  .int32('group_length')
  .string('group', { length: 'group_length', stripNull: 'true'})
  .int32('metadata_length')
  .string('metadata', { length: 'metadata_length', stripNull: 'true'})
  .uint32('time1')
  .uint32('time2')
  .uint32('SizeInBytes')
  .buffer('buffer', { readUntil: 'eof'})

// -----

const MatchTeamStats = new Parser()
  .endianess('little')
  .uint32('unkown')
  .uint32('final_ranking')
  .uint32('total_players')

const MatchStats = new Parser()
  .endianess('little')
  .uint32('unkown1')
  .uint32('unkown2')
  .uint32('unkown3')
  .uint32('total_eliminations')

const PlayerElim = new Parser()
  .endianess('little')
  .skip(45)
  .int32('a_length', {
    formatter: function(int) {
      return int < 0 ? -int*2 : int;
    }
  })
  .string('killed', {
    length: 'a_length',
    encoding: 'hex',
    stripNull: 'true',
    formatter: function(str) {
      if(/0000$/.test(str)) {
        return new Buffer(str, 'hex').toString('ucs2').replace(/\u0000$/, '');
      }
      return new Buffer(str, 'hex').toString('utf8').replace(/\u0000$/, '');
    }
  })
  .int32('b_length', {
    formatter: function(int) {
      return int < 0 ? -int*2 : int;
    }
  })
  .string('killer', {
    length: 'b_length',
    encoding: 'hex',
    stripNull: 'true',
    formatter: function(str) {
      if(/0000$/.test(str)) {
        return new Buffer(str, 'hex').toString('ucs2').replace(/\u0000$/, '');
      }
      return new Buffer(str, 'hex').toString('utf8').replace(/\u0000$/, '');
    }
  })
  .uint32('type')

const CheckpointHeader = new Parser()
  .endianess('little')


const parser = {
  ReplayParser: ReplayParser,
  Header: HeaderChunk,
  ReplayData: ReplayDataChunk,
  Checkpoint: CheckpointChunk,
  Event: EventChunk,

  MatchTeamStats: MatchTeamStats,
  MatchStats: MatchStats,
  PlayerElim: PlayerElim,

  CheckpointHeader: CheckpointHeader,
};

const parse = function(buffer) {
  var data = ReplayParser.parse(buffer);

  // Header cleanup
  data.header.LengthInMS = {
    ms: data.header.LengthInMS,
    string: utils.msToInterval(data.header.LengthInMS)
  };
  delete data.header.FriendlyNameSize;
  data.header.FriendlyName = data.header.FriendlyName.trim();
  data.header.Timestamp = bignum(
    bignum.fromBuffer(data.header.Timestamp, { endian: 'little', size: 8  })
    .sub(bignum('621355968000000000'))
    ).div(10000);
  data.header.Timestamp = new Date(data.header.Timestamp.toNumber());

  // Chunks cleanup

  data.chunks = data.chunks.map((chunk) => {
    chunk.ChunkType = ELocalFileChunkType[chunk.ChunkType];
    chunk.res = parser[chunk.ChunkType].parse(chunk.buffer);

    if(chunk.res.metadata == 'AthenaMatchTeamStats') {
      chunk.res.res = parser.MatchTeamStats.parse(chunk.res.buffer);
      delete chunk.res.buffer;
    } else if(chunk.res.metadata == 'AthenaMatchStats') {
      chunk.res.res = parser.MatchStats.parse(chunk.res.buffer);
      delete chunk.res.buffer;
    } else if(chunk.res.group == 'playerElim') {
      chunk.res.res = parser.PlayerElim.parse(chunk.res.buffer);
      delete chunk.res.buffer;
      delete chunk.res.res.a_length;
      delete chunk.res.res.b_length;
    } else if(chunk.res.group == 'checkpoint' && chunk.res.buffer) {
      chunk.res.res = parser.CheckpointHeader.parse(chunk.res.buffer);
    }

    if(chunk.res.buffer && chunk.res.buffer.length === 0) {
      delete chunk.res.buffer;
    }
    if(chunk.res.buffer) {
      chunk.res.buffer = chunk.res.buffer.length;
    }
    chunk.buffer = chunk.buffer.length;
    return chunk;
  });

  return data;
}

module.exports = {
  parse: parse,
};