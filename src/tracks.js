export async function getTrackInfo(access_token) {
  const response = await fetch(
    'https://api.spotify.com/v1/tracks/4cOdK2wGLETKBW3PvgPWqT',
    {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + access_token },
    }
  );

  return await response.json();
}
