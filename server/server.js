require('./env');

const httpModule = require('http');
const express = require('express');
const helmet = require('express');
const compression = require('compression');

const api = require('./api/index');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;

const server = express();

server.use(helmet());
server.use(compression());
server.use(express.json());

api(server);

const httpServer = httpModule.createServer(server);

server.get('*', (_, res) => {
  res.sendStatus(403);
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${dev ? process.env.URL_API : process.env.PROD_URL_API}`);
});
