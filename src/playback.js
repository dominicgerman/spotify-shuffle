export async function getPlaybackState(access_token) {
  const response = await fetch('https://api.spotify.com/v1/me/player', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + access_token },
  })
  return await response.json()
}

export async function startPlayback(access_token, device_id) {
  const response = await fetch(`https://api.spotify.com/v1/me/player/play/`, {
    method: 'PUT',
    body: JSON.stringify({
      context_uri: 'spotify:album:5ht7ItJgpBH7W6vJ5BqpPr',
    }),
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  })
  const result = await response.json()
  console.log(result)
}
