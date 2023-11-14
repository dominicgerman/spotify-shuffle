import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { getPlaybackState, startPlayback } from './playback.js'
import { getAvailableDevices } from './devices.js'
import 'dotenv/config'
// import { getToken } from './auth.js'
// import { getPlaylistByName } from './playlists.js';
// import { getTrack } from './tracks.js';r

let access_token = process.env.TOKEN
let device_id = process.env.DEVICE_ID

yargs(hideBin(process.argv))
  .command(
    'play',
    'start playback',
    () => {},
    async () => {
      return await startPlayback(access_token, device_id)
    }
  )
  .command(
    'devices',
    'see a list of available devices',
    () => {},
    async () => {
      const devices = await getAvailableDevices(access_token)
      console.log(devices)
    }
  )
  .command(
    'shuffle <playlist>',
    'shuffle a playlist',
    (yargs) => {
      return yargs.positional('playlist', {
        describe: 'The playlist you want to shuffle',
        type: 'string',
      })
    },
    async (argv) => {
      const playbackState = await getPlaybackState('')
      console.log(playbackState.json())
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
  .parse()
