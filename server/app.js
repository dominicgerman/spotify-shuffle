import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';
import querystring from 'node:querystring';
import { scopes } from '../spotify.config.js';
import { createCredentials } from '../src/db.js';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:8888/callback`; // Your redirect uri
const PORT = 8888;

const app = express();

app.use(cors());

app.listen(PORT, () => {
  console.log('App listening on port', PORT);
});

app.get('/', (req, res) => {
  res.send(
    '<h1>Hey there. This is a server running as part of your spotify shuffle app.</h1>'
  );
});

app.get('/login', (req, res) => {
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scopes.join(' '),
        redirect_uri: REDIRECT_URI,
      })
  );
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    querystring.stringify({
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
      },
    }
  );
  if (response.status === 200) {
    response.data.expiration = Date.now() + 3600000;
    await createCredentials(response.data);
    res.send('<h1>Success! You can close this window now.</h1>');
  } else {
    console.log('ERROR:', response.status, response.statusText, response.data);
  }
});
