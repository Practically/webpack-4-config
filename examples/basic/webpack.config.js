const c = require('../../index.js');
const path = require('path');

c.initialize({entry_point: [path.resolve(__dirname, 'index.js')]});

module.exports = c.build();
