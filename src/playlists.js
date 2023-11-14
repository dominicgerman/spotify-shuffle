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
