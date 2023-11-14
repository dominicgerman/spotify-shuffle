import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getToken } from './auth.js';
import { getPlaybackState, togglePlayback } from './playback.js';
// import { getPlaylistByName } from './playlists.js';
// import { getTrack } from './tracks.js';r

yargs(hideBin(process.argv))
  .command(
    'login',
    'login into spotify',
    () => {},
    async () => {
      getToken().then((response) => {
        console.log(response);
        // getTrackInfo(response.access_token).then((profile) => {
        //   console.log(profile);
        // });
      });
    }
  )
  .command(
    'shuffle <playlist>',
    'shuffle a playlist',
    (yargs) => {
      return yargs.positional('playlist', {
        describe: 'The playlist you want to shuffle',
        type: 'string',
      });
    },
    async (argv) => {
      const playbackState = await getPlaybackState('');
      console.log(playbackState.json());
      //   togglePlayback(
      //     ''
      //   ).then((res) => {
      //     console.log('res', res);
      //   });

      //   const track = argv.track ? await getTrack(argv.track) : 'poop';
    }
  )
  .option('track', {
    alias: 't',
    type: 'string',
    description: 'track to play first',
  })
  .demandCommand(1)
  .parse();
