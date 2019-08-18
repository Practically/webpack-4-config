const c = require('../../index.js');
const path = require('path');

c.initialize({entry_point: [path.resolve(__dirname, 'src', 'index.ts')]});

c.typescript();

module.exports = c.build();
