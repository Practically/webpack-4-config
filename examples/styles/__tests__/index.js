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

    const jsContent = fs
        .readFileSync(parentDir + '/dist/js/main.js')
        .toString();

    expect(jsContent).toContain('/*! ./styles.css */');
    expect(jsContent).toContain('/*! ./styles.scss */');
    expect(jsContent).toContain('/*! ./styles.less */');

    const cssContent = fs
        .readFileSync(parentDir + '/dist/css/main.css')
        .toString();

    expect(cssContent).toContain('css-class');
    expect(cssContent).toContain('scss-class');
    expect(cssContent).toContain('less-class');

    expect(cssContent).toContain('user-select: none;');
    expect(cssContent).toContain('-ms-user-select: none;');
    expect(cssContent).toContain('-webkit-user-select: none;');
});
