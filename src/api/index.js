const publicExpressRoutes = require('./public');

function handleError(err, _, res, __) {
  console.error(err.stack);

  res.json({ error: err.message || err.toString() });
}

// API server routes
function api(server) {
    server.use('/api/v1', publicExpressRoutes, handleError);
}

module.exports = api;