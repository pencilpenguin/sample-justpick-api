const https = require('https');
const querystring = require('querystring');
const express = require('express');
const request = require('request');
const { resolve } = require('path');
const { rejects } = require('assert');

const router = express.Router();

router.get('/get-listings-from-yelp', (req, res) => {
    const parameters = {
        location: req.query.location,
    };

    const options = {
      url: `https://${process.env.YELP_URL}/v3/businesses/search?${querystring.stringify(parameters)}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`
      },
    };

    const request = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Did not get a Created from the server. Code: ${res.statusCode}`);
        res.resume();
        return;
      }
    
      let data = '';
    
      res.on('data', (chunk) => {
        data += chunk;
      });
    
      res.on('end', () => {
        console.log('Added new user');
        console.log(JSON.parse(data));
      });


    })

    request.on('error', (err) => {
      console.error(`Encountered an error trying to make a request: ${err.message}`);
    });
});

module.exports = router;