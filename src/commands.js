import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { authenticate, startServer, stopServer } from './auth.js';
import { getPlaylistByName } from './playlists.js';
import { startPlayback, stopPlayback } from './playback.js';
import { getPlaylists, getCredentials } from './db.js';
import { getNextTracks, getTrackInfo } from './tracks.js';

yargs(hideBin(process.argv))
  .command(
    'start',
    'start your local spotify server',
    () => {},
    async () => {
      const server = await startServer();
      return server;
    }
  )
  .command(
    'exit',
    'shutdown server',
    () => {},
    async () => {
      const cleanup = await stopServer();
      return cleanup;
    }
  )
  .command(
    'login',
    'login to spotify',
    () => {},
    async () => {
      await authenticate();
    }
  )
  .command(
    'credentials',
    'get those credentials',
    () => {},
    async () => {
      await getCredentials();
    }
  )
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
          device_id: data.device_id,
          access_token: data.access_token,
          offset: argv.track
            ? {
                uri: '',
              }
            : null,
        };
        if (argv.track) {
          const { items, next } = await getTrackInfo(options);
          if (next) {
            const { items: nextItems, next: nextUrl } = await getNextTracks(
              data.access_token,
              next
            );
            items.push(...nextItems);
            if (nextUrl) {
              const { items: lastItems } = await getNextTracks(
                data.access_token,
                nextUrl
              );
              items.push(...lastItems);
            }
          }
          const matches = items
            .map((item, i) => {
              return {
                item,
                i,
              };
            })
            .filter((obj) =>
              obj.item.track.name
                .toLowerCase()
                .includes(options.track.toLowerCase())
            );

          options.offset.uri = matches[0].item.track.uri;
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
    'playlists',
    'see a list of available playlists',
    () => {},
    async () => {
      const playlists = await getPlaylists();
      playlists.forEach((element) => {
        console.log(element.name);
      });
    }
  )
  .demandCommand(1)
  .parse();
