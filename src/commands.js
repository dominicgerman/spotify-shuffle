import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getCredentials } from './auth.js';
import { getPlaylistByName, getAvailablePlaylists } from './playlists.js';
import {
  getPlaybackState,
  startPlayback,
  stopPlayback,
  getAvailableDevices,
} from './playback.js';
import { insertDevices, insertPlaylists } from './db.js';

yargs(hideBin(process.argv))
  .command(
    'shuffle <playlist>',
    'shuffle a playist',
    (yargs) => {
      return yargs.positional('playlist', {
        describe: 'The name of the playlist you want to shuffle',
        type: 'string',
      });
    },
    async (argv) => {
      const data = await getCredentials();
      if (data.access_token) {
        const playlist = await getPlaylistByName(argv.playlist);
        const options = {
          context_uri: playlist ? `spotify:playlist:${playlist}` : null,
          track: argv.track ? argv.track : null,
          playlist_id: playlist ? playlist : null,
        };
        if (options.track) {
          console.log(options.track);
        }
        return await startPlayback(data.access_token, options);
      }
    }
  )
  .option('track', {
    alias: 't',
    type: 'string',
    description: 'track to play first',
  })
  .command(
    'pause',
    'pause playback',
    () => {},
    async () => {
      const data = await getCredentials();
      if (data.access_token) {
        return await stopPlayback(data.access_token);
      }
    }
  )
  .command(
    'devices',
    'see a list of available devices',
    () => {},
    async () => {
      const data = await getCredentials();
      if (data.access_token) {
        const { devices } = await getAvailableDevices(data.access_token);
        devices.forEach((item) => console.log(item.name));
        return await insertDevices(devices);
      }
    }
  )
  .command(
    'playlists',
    'see a list of available playlists',
    () => {},
    async () => {
      const data = await getCredentials();
      if (data.access_token) {
        const playlists = await getAvailablePlaylists(data.access_token);
        playlists.items.forEach((item) => {
          console.log(item.name);
        });
        return await insertPlaylists(playlists.items);
      }
    }
  )
  // .command(
  //   'shuffle <playlist>',
  //   'shuffle a playlist',
  //   (yargs) => {
  //     return yargs.positional('playlist', {
  //       describe: 'The playlist you want to shuffle',
  //       type: 'string',
  //     });
  //   },
  //   async (argv) => {
  //     const playbackState = await getPlaybackState('');
  //     console.log(playbackState.json());
  //     //   togglePlayback(
  //     //     ''
  //     //   ).then((res) => {
  //     //     console.log('res', res);
  //     //   });

  //     //   const track = argv.track ? await getTrack(argv.track) : 'poop';
  //   }
  // )
  .demandCommand(1)
  .parse();
