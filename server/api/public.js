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

router.get('/get-listings-from-google-places', async (req, res) => {
  let listings = {}
  
  const parameters = {
    key: process.env.GCP_API_KEY,
    input: req.query.input,
    inputtype: 'textquery',
    fields:'business_status,formatted_address,geometry,icon,name,photos,place_id,plus_code,types',
    locationbias: `circle:${req.query.rad}@${req.query.lat},${req.query.long}`
  }

  const options = {
    host: process.env.GOOGLE_MAPS_URL,
    path: `/maps/api/place/findplacefromtext/json?${querystring.stringify(parameters)}`,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  };

  try {
    listings = await request(options);
  } catch (err) {
    console.log(err);
  }

  res.json(listings);

});


module.exports = router;