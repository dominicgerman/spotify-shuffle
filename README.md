# spotify-shuffle

A command line tool for shuffling my spotify playlists.

## The problem
I often want to shuffle a playlist while I code and I frequently have a specific song I want to play first. Many of my playlists are hundreds of songs long which means I have to search for the song first by filtering the playlist. However, once I filter for that song and double click it to start playback, Spotify won't continue playing the rest of the playlist because I've just filtered out all the other songs. 

Thus, the process: open the playlist, filter for the song, queue it, escape the filter, start the playlist with a different song, and finally skip ahead one track to the one I queued. 

This was a pain in the ass.

## The solution

I wrote this app so that I could run one command from my terminal that would start the desired playlist at the location of the desired song without any queuing or skipping and without taking my hands off the keyboard.

I also wanted to practice building a command line tool (mostly) from scratch in Node.js.

## Commands

- `spotify start` starts a server in the background on port 8888. This is needed in order to authenitcate with Spotify.
- `spotify login` opens a browser window to autheniticate with spotify and saves your credentials.
- `spotify playlists` will show you a list of your playlists.
- `spotify shuffle <playlist>` starts playback of the playlist you want to shuffle.
- `-t, --track <track_name>` is the option for passing in the song you want to play first.

Here's an example of shuffling a playlist called 'vibez' and starting with the song 'Eventualy':

`spotify shuffle vibez -t eventually`

