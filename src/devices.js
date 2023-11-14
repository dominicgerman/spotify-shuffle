export async function getAvailableDevices(access_token) {
  const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + access_token },
  })
  return await response.json()
}
