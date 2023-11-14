export async function getPlaybackState(access_token) {
  const response = await fetch('https://api.spotify.com/v1/me/player', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + access_token },
  });
  return await response.json();
}

export async function togglePlayback(access_token) {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/${
      playbackState.is_playing ? 'pause' : 'play'
    }`,
    {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + access_token },
    }
  );

  return await response.json();
}
