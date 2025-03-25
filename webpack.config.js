const path = require('/');

module.exports = {
  // ... your other webpack configurations ...
  devServer: {
    https: {
      key: path.resolve(__dirname, 'localhost-key.pem'),
      cert: path.resolve(__dirname, 'localhost.pem'),
    },
    // ... other devServer options ...
  },
};