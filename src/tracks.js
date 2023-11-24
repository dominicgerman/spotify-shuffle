export async function getTrackInfo(options) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${options.playlist_id}/tracks`,
    // `https://api.spotify.com/v1/playlists/3MQyyfsQGaV8U91L6O1K7a/tracks?offset=0&limit=100&locale=*`,
    {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + options.access_token },
    }
  );
  return await response.json();
}
