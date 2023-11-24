import fs from 'node:fs/promises';
import 'dotenv/config';
import open from 'open';
import { exec } from 'node:child_process';

const CREDENTIALS_PATH = new URL('../credentials.json', import.meta.url)
  .pathname;
const SERVER_PATH = new URL('../server/app.js', import.meta.url).pathname;

export async function startServer() {
  exec(
    `pm2 start /Users/dominicgerman/Programming/projects/spotify-shuffle/server/app.js`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
}

export function stopServer() {
  exec(`pm2 stop app && pm2 delete app`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

export async function authenticate() {
  await open('http://localhost:8888/login');
  console.log('done logging in!');
}

// export async function getCredentials() {
//   const data = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
//   const credentials = JSON.parse(data);
//   if (credentials.expiration > Date.now()) {
//     return credentials;
//   } else {
//     throw new Error('You need to re-authenticate');
//   }
// }
