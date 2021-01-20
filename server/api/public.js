const https = require('https');
const querystring = require('querystring');
const express = require('express');
const request = require('request');
const { resolve } = require('path');
const { rejects } = require('assert');

const router = express.Router();

router.get('/get-listings-from-yelp', async (req, res) => {
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

    try {
      let listings = await request(options, (err, res, body) => {
        if (err) {
          throw err;
        }
        console.log(body);
        return body;
      });
      res.json(listings);
    } catch (err) {
      console.log(err);
    }

});

module.exports = router;