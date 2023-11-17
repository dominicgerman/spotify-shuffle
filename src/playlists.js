import { getDB } from './db.js';

export async function getPlaylistByName(name) {
  const db = await getDB();
  const matches = db.playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(name.toLowerCase())
  );

  if (matches.length >= 1) {
    return matches[0].id;
  } else {
    throw new Error(`No matches for ${name}`);
  }
}

export async function getAvailablePlaylists(access_token) {
  const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + access_token },
  });
  return await response.json();
}
