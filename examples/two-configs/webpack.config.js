const c = require('../../index.js');
const path = require('path');

c.initialize({entry_point: [path.resolve(__dirname, 'index.js')]});
c.styles();
const configOne = c.build();

c.initialize({entry_point: [path.resolve(__dirname, 'server.js')]});
const configTwo = c.build();
configTwo.devtool = '(none)';
configTwo.target = 'node';
configTwo.output = {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
};

module.exports = [configOne, configTwo];
