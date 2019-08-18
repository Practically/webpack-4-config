const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const {spawnSync} = require('child_process');

const parentDir = path.dirname(__dirname);

beforeEach(() => {
    process.chdir(parentDir);
});

afterEach(() => {
    rimraf.sync(path.join(parentDir, 'dist'));
});

test('Test the webpack run successfully', () => {
    const command = spawnSync('webpack');
    expect(command.error).toBeUndefined();

    const content = fs.readFileSync(parentDir + '/dist/js/main.js').toString();

    expect(content).toContain('!*** ./index.ts ***!');
    expect(content).toContain('var myFunction = function (props) {');
});
