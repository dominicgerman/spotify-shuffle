import sqlite3 from 'sqlite3';
import fs from 'node:fs/promises';
import { getAvailablePlaylists } from './playlists.js';
import { getAvailableDevices } from './playback.js';

const DB_PATH = new URL('../data.db', import.meta.url).pathname;
const SQLite3 = sqlite3.verbose();
export const db = new SQLite3.Database(DB_PATH);

const query = (command, method = 'all') => {
  return new Promise((resolve, reject) => {
    db[method](command, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// async function createPlaylistsIfEmpty() {
//   const existingPlaylists = await getPlaylists();

//   if (existingPlaylists?.length === 0) {
//     const data = await getCredentials();
//     console.log(data);
//     const { items } = await getAvailablePlaylists(data.access_token);
//     const tempDB = items.map((element) => {
//       return {
//         playlist_id: element.id,
//         name: element.name,
//         tracks_url: element.tracks.href,
//       };
//     });
//     for (let i = 0; tempDB.length; i++) {
//       const element = tempDB[i];
//       await query(
//         `INSERT INTO playlists(playlist_id, name, tracks_url) VALUES (${element.playlist_id},${element.name},${element.tracks_url})`,
//         'all'
//       );
//     }
//   }
// }

export async function createCredentials(data) {
  const { devices } = await getAvailableDevices(data.access_token);
  const existingCredentials = await getCredentials();
  console.log('existingCredentials:', existingCredentials);

  if (!existingCredentials) {
    console.log('Creating!');
    db.serialize(async () => {
      await query(
        'CREATE TABLE IF NOT EXISTS credentials(device_id TEXT, device_name TEXT, access_token TEXT, refresh_token TEXT, expires_in INTEGER, expiration INTEGER, scope TEXT, token_type TEXT)'
      );
      await query(
        `INSERT INTO credentials(device_id, device_name, access_token, refresh_token, expires_in, expiration, scope, token_type) VALUES ("${devices[0].id}", "${devices[0].name}", "${data.access_token}","${data.refresh_token}",${data.expires_in},${data.expiration},"${data.scope}","${data.token_type}")`
      );
      // await createPlaylistsIfEmpty();
    });
  } else {
    console.log('Updating!');
    await query(
      `UPDATE credentials SET access_token = "${data.access_token}", refresh_token = "${data.refresh_token}", expires_in = ${data.expires_in}, expiration = ${data.expiration} WHERE expires_in = 3600`
    );
  }
}

export async function getPlaylists() {
  return await query('SELECT * FROM playlists');
}

export async function getCredentials() {
  // if credentials table doesn't exist, this query returns 0
  const response = await query(`SELECT EXISTS (
      SELECT 
          name
      FROM 
          sqlite_master 
      WHERE 
          type='table' AND 
          name='credentials'
      )`);
  const credentialsExist = Object.values(response[0])[0];
  if (credentialsExist === 0) {
    return undefined;
  } else {
    const credentials = await query(`SELECT * FROM credentials`);
    console.log(credentials);
    return credentials[0];
  }
}
// OLD SHIT

// TODO - Move Devices and Credentials db stuff into sqlite
// export async function getDB() {
//   const db = await fs.readFile(DB_PATH, 'utf-8');
//   return JSON.parse(db);
// }

export async function saveDB(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  return db;
}

export async function insertDevices(data) {
  const db = await getDB();
  db.devices = [...data];
  await saveDB(db);
  return data;
}
