const querystring = require('querystring');
const express = require('express');

const { request } = require('../utils/requests');
const { getListingsFromYelp, getLocationCoordinates } = require('../services/services');

const router = express.Router();


/**
 * GET Methods
 */

/**
 * Get a list of restaurants near a pair of latitude and longitude coordinates pair.
 * If the latitude and longitude parameters are missing, then they are set by getting
 * them from a location parameter.
 * 
 * @param lat {string}
 * @param long {string}
 * @param loc {string}
 */
router.get('/listings', async (req, res) => {
  let listings = {}
  let latitude = ""
  let longitude = ""
  let limit = 50
  let offset = 0

  if (Object.keys(req.query) == 0) {
    return res.status(400).json({
      "error": "invalid_input",
      "message": "Missing latitude, longitude pair parameters or a location name parameter"
    })
  }

  if (!req.query.lat && !req.query.long && !req.query.loc) {
    return res.status(400).json({
      "error": "invalid_input",
      "message": "Missing latitude, longitude pair parameters or location name parameter"
    })
  }

  // Check if the location coordinates are missing but the location name is provided
  if ((!req.query.lat && !req.query.long) && req.query.loc) {
    // Attempt to get the latitude and longitude coordinates from the provided location parameter
    try {
      let loc = await getLocationCoordinates(req.query.loc)
      latitude = loc.latitude
      longitude = loc.longitude
    }
    catch (err) {
      res.status(400).json({
        "error": "invalid_location",
        "message": `${req.query.loc} did not return any results`
      })
    }
  } else {
    latitude = req.query.lat
    longitude = req.query.long
  }

  if (req.query.limit && req.query.offset) {
    limit = req.query.limit
    offset = req.query.offsetk
  }

  try {
    listings = await getListingsFromYelp(latitude, longitude, limit, offset)
    return res.status(200).json(listings)
  } catch (err) {
    res.status(err.statusCode).send(err.statusMessage)
  }

})


router.get('/listings-yelp', async (req, res) => {
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

router.get('/listings-googleplaces', async (req, res) => {
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

/**
 * POST Methods
 */

module.exports = router;