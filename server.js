const debug = require('debug')('calendar');
const express = require('express');
const log = require('morgan');
const path = require('path');

const app = express();
const appName = 'calendar';
const port = process.env.PORT || 2112;

debug('Booting... %o', appName);
app.use(log('dev'));

// Base...
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Export
if (require.main === module) {
  app.listen(port, () => {
    console.debug('express port: %d', port);
  });
} else {
  module.exports = app;
}
