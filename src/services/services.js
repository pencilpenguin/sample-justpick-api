
const querystring = require('querystring');

const { request, httpRequest } = require('../utils/requests');



/**
 * Make a request to the Yelp Fusion API to get a list of
 * restaurants near the latitude and longtitude provided.
 */
getListingsFromYelp = async (latitude, longitude, limit, offset) => {
    let listings = {
        "businesses": [],
        "total": 0
    }
    let totalListings = 0

    let parameters = {
        latitude: latitude,
        longitude: longitude,
        limit: limit,
        offset: offset
    };

    let options = {
      host: process.env.YELP_URL,
      path: `/v3/businesses/search?${querystring.stringify(parameters)}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.YELP_API_KEY}`
      },
    };
    
    try {
       let response = await request(options);
       totalListings = response["total"]
       listings["businesses"] = response["businesses"]
       listings["total"] = response["total"]
       while(totalListings > 0) {
            parameters.offset += 50
            options.path = `/v3/businesses/search?${querystring.stringify(parameters)}`
            response = await request(options)
            totalListings -= limit
            listings["businesses"] = listings["businesses"].concat(response["businesses"]);
       }
       return listings
    } catch (err) {
      throw err
    }
}
module.exports.getListingsFromYelp = getListingsFromYelp;

/**
 * 
 */
getLocationCoordinates = async (location) => {
    const parameters = {
        access_key: process.env.POSITIONSTACK_ACCESSKEY,
        query: location,
    }

    const options = {
        host: process.env.POSITIONSTACK_URL,
        path: `/v1/forward?${querystring.stringify(parameters)}`,
        method: 'GET',
    };

    try {
        resp = await httpRequest(options);
        if (resp.data.length != 0) {
            return resp["data"][0]
        }
        else {
            throw new Error("Invalid location")
        }
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
module.exports.getLocationCoordinates = getLocationCoordinates;
