const https = require('https');

const request = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  })
})

request.on('error', error => {
  console.error(error);
})

request.end();

module.exports = request;