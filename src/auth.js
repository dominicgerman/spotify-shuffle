import fs from 'node:fs/promises';
import 'dotenv/config';

const CREDENTIALS_PATH = new URL('../credentials.json', import.meta.url);

export async function getCredentials() {
  const data = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const credentials = JSON.parse(data);
  if (credentials.expiration > Date.now()) {
    return credentials;
  } else {
    throw new Error('You need to re-authenticate');
  }
}
