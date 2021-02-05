const https = require('https');
const http = require('http');

request = (options) => {
 return new Promise((resolve, reject) => {
  let request = https.request(options, (res) => {
    if (res.statusCode !== 200) {
      console.error(`Request unsuccessful. Code: ${res.statusCode}`);
      res.resume();
      reject(res);
    }

    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Response complete');
      // console.log(JSON.parse(data));
      resolve(JSON.parse(data));
    });
  });

  request.end();

  request.on('error', (err) => {
    console.error(`Encountered an error trying to make a request: ${err.message}`);
    reject(err);
  });

 });
}
module.exports.request = request;

httpRequest = (options) => {
  return new Promise((resolve, reject) => {
   let request = http.request(options, (res) => {
     if (res.statusCode !== 200) {
       console.error(`Request unsuccessful. Code: ${res.statusCode}`);
       res.resume();
       reject(res);
     }
 
     let data = '';
 
     res.on('data', (chunk) => {
       data += chunk;
     });
 
     res.on('end', () => {
       console.log('Response complete');
       console.log(JSON.parse(data));
       resolve(JSON.parse(data));
     });
   });
 
   request.end();
 
   request.on('error', (err) => {
     console.error(`Encountered an error trying to make a request: ${err.message}`);
     reject(err);
   });
 
  });
 }
module.exports.httpRequest = httpRequest;