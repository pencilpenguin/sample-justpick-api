const querystring = require('querystring');
const express = require('express');

const request = require('../utils/requests');

const router = express.Router();

router.get('/get-listings-from-yelp', async (req, res) => {
    let listings = {};

    const parameters = {
        location: req.query.location,
    };

    const options = {
      host: process.env.YELP_URL,
      path: `/v3/businesses/search?${querystring.stringify(parameters)}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`
      },
    };
    
    try {
       listings = await request(options);
       res.json(listings);
    } catch (err) {
      console.log(err);
      res.json({
        "error": err
      })
    }

});

module.exports = router;