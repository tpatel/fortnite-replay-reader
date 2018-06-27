# Fortnite replay reader

> ✨ Create a JSON object from a Fortnite replay file.

## Install

For now I haven't published this package to NPM as it isn't ready for prime time 🙉

```
$ git clone git@github.com:tpatel/fortnite-replay-reader.git
```

## Usage

For now you can only run the main executable without configuration (it always targets the hardcoded file from index.js).

```
$ node index.js
```

For the file `test3.replay` from the `data/` directory, the parser returns the following JSON:

```
{
  "unknown1": 480436863,
  "unknown2": 3,
  "match_duration_ms": 827599,
  "unknown4": 2,
  "version": 4000805,
  "name_length": 257,
  "name": "Unsaved Replay                                                                                                                                                                                                                                                  ",
  "game_length": 23,
  "game": "++Fortnite+Release-3.5",
  "map_length": 33,
  "map": "/Game/Athena/Maps/Athena_Terrain"
}
```

## TODO

🆘 This project can benefit from your help

- Collect more replay files, especially from the latest Fortnite version.
- Figure out more of the replay file structure.

## License

MIT © Thibaut Patel
