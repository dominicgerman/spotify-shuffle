import sqlite3 from 'sqlite3';
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

export async function createCredentials(data) {
  const { devices } = await getAvailableDevices(data.access_token);
  const existingCredentials = await getCredentials();

  if (!existingCredentials) {
    console.log('Creating credentials!');
    db.serialize(async () => {
      await query(
        'CREATE TABLE IF NOT EXISTS credentials(device_id TEXT, device_name TEXT, access_token TEXT, refresh_token TEXT, expires_in INTEGER, expiration INTEGER, scope TEXT, token_type TEXT)'
      );
      await query(
        `INSERT INTO credentials(device_id, device_name, access_token, refresh_token, expires_in, expiration, scope, token_type) VALUES ("${devices[0].id}", "${devices[0].name}", "${data.access_token}","${data.refresh_token}",${data.expires_in},${data.expiration},"${data.scope}","${data.token_type}")`
      );
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
    return credentials[0];
  }
}
