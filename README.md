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

For the file `UnsavedReplay-2018.07.15-23.26.39.replay` from the `data/` directory, the parser returns the following JSON header:

```
{
  "MagicNumber": 480436863,
  "FileVersion": 5,
  "LengthInMS": {
    "ms": 227548,
    "string": "03:47"
  },
  "NetworkVersion": 2,
  "Changelist": 4200584,
  "FriendlyName": "Unsaved Replay",
  "IsLive": false,
  "Timestamp": "2018-07-15T23:26:39.637Z",
  "Compressed": true
}
```

You can also use the chunks data to list the player eliminations like in the following output:

```
00:06  [LordKirk3333] eliminated [Porco Ninja] [267]
00:09  [kożuch] eliminated [Cl_Ra_] [260]
00:09  [LordKirk3333] eliminated [Porco Ninja] [5]
00:10  [CrisRon69] eliminated [N.o.F.e.a.r] [259]
00:13  [BortasTutej] eliminated [Cl_Ra_] [3]
00:15  [LordKirk3333] eliminated [CrisRon69] [3]
00:15  [kożuch] eliminated [sID_11] [3]
00:40  [N.o.F.e.a.r] eliminated [N.o.F.e.a.r] [15]
00:41  [furkanO45] eliminated [LordKirk3333] [4]
00:44  [Emerovsky] eliminated [BurningHorn] [4]
00:45  [furkanO45] eliminated [furkanO45] [257]
01:13  [flarson] eliminated [ainu19] [260]
01:24  [flarson] eliminated [ainu19] [3]
01:29  [ゴテンクス3] eliminated [idir15] [3]
02:05  [MulleOst] eliminated [LeqitParkourYT] [262]
02:28  [hampa1] eliminated [Pratro] [264]
02:35  [hampa1] eliminated [Pratro] [3]
02:52  [MulleOst] eliminated [LeqitParkourYT] [4]
03:07  [thibpat] eliminated [thibpat] [1]
03:41  [イサイアス] eliminated [Zappelluca] [260]
03:41  [ガスパルエンジェル] eliminated [FluffyRainbowYT] [260]
```

## TODO

🆘 This project can benefit from your help

- Collect more replay files, especially from the latest Fortnite version.
- Figure out more of the replay file structure.

## License

MIT © Thibaut Patel
