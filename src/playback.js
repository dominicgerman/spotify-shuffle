import axios from 'axios';

export async function getAvailableDevices(access_token) {
  const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + access_token },
  });
  return await response.json();
}

export async function startPlayback(access_token, options) {
  const response = await axios(
    `https://api.spotify.com/v1/me/player/play?device_id=${options.device_id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
      data: {
        context_uri: options.context_uri,
        offset: options.offset ? { uri: options.offset.uri } : null,
      },
    }
  );
  if (response.status !== 204) console.log(response);
}

export async function stopPlayback(access_token) {
  const response = await axios(`https://api.spotify.com/v1/me/player/pause/`, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + access_token,
    },
  });
  if (response.status !== 204) console.log(response);
}
