// Only import this file once, at entrypoint

const dotenv = require('dotenv');
const result = dotenv.config();

// Only override process.env if .env file is present and valid
if (!result.error) {
  Object.keys(result.parsed).forEach((key) => {
    const value = result.parsed[key];
    if (value) {
      process.env[key] = value;
    }
  });
}