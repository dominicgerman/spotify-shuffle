export async function getTrackInfo(options) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${options.playlist_id}/tracks`,
    {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + options.access_token },
    }
  );
  return await response.json();
}

export async function getNextTracks(token, url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
  });
  return await response.json();
}
