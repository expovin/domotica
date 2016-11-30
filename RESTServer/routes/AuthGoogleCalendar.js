var express = require('express');
var bodyParser = require('body-parser');
var google = require('googleapis');
var readline = require('readline');
var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');

var router = express.Router();

/* GET all Sensors */
router.route('/')

.get(function(req, res, next){
    console.log("Sono arrivato nella GET di autorizzazione!!!");

    var CLIENT_ID = '504982171121-ekau4mth7f8jn203rglcome0d7o6kuqk.apps.googleusercontent.com';
    var CLIENT_SECRET = '5gRPaWqgm81Y1eYrZhl6g0U7';
    var REDIRECT_URL = 'http://raspytest:3000/EventiCalendario';

    var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    function getAccessToken (oauth2Client, callback) {
      // generate consent page url
      var url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        scope: 'https://www.googleapis.com/auth/plus.me' // can be a space-delimited string or an array of scopes
      });

      req.get({url: url, headers: req.headers});
      processRequest(req);
      res.setHeader('Content-Type', 'application/json');
      res.send('Req OK');      

      console.log('Visit the url: ', url);
      rl.question('Enter the code here:', function (code) {
        // request access token
        oauth2Client.getToken(code, function (err, tokens) {
          if (err) {
            return callback(err);
          }
          // set tokens to the client
          // TODO: tokens should be set by OAuth2 client.
          oauth2Client.setCredentials(tokens);
          callback();
        });
      });
    }

    // retrieve an access token
    getAccessToken(oauth2Client, function () {
      // retrieve user profile
      plus.people.get({ userId: 'me', auth: oauth2Client }, function (err, profile) {
        if (err) {
          return console.log('An error occured', err);
        }
        console.log(profile.displayName, ':', profile.tagline);
      });
    });

});

module.exports = router;