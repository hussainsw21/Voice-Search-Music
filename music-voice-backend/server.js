const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());

// Initialize the Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: '47deb70fa2fe425f82f4047171e8c285', 
  clientSecret: 'f2c97ee641614cdbb48c9982eccc786b', 
  redirectUri: 'http://localhost:3000/callback'
});

// Function to get and set the access token
const getAccessToken = () => {
  return spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token is ' + data.body['access_token']);
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
};

// Call the function to set the access token when the server starts
getAccessToken();

// Search endpoint
app.get('/search', (req, res) => {
  const query = req.query.q;

  // Ensure we have an access token before searching
  if (!spotifyApi.getAccessToken()) {
    return res.status(401).send('No token provided');
  }

  spotifyApi.searchTracks(query)
    .then(data => {
      res.json(data.body.tracks.items);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error searching tracks');
    });
});

// Start the server
app.listen(4000, () => {
  console.log('Backend server running on port 4000');
});

