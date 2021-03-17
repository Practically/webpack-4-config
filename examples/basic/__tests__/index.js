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
    const exe = path.resolve(
        path.dirname(path.dirname(parentDir)),
        'node_modules',
        '.bin',
        'webpack-cli'
    );

    const command = spawnSync(exe);
    expect(command.error).toBeUndefined();

    const content = fs.readFileSync(parentDir + '/dist/js/main.js').toString();
    expect(content).toContain('The first example');
    expect(content).toContain('* This is a basic example');
});
