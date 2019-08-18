const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const {spawnSync, spawn} = require('child_process');

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

    expect(jsContent).toContain('/*! ./styles/index.scss */');
    expect(jsContent).toContain('function rotate(image) {');
    expect(jsContent).toContain('function setImage(img) {');

    const cssContent = fs
        .readFileSync(parentDir + '/dist/css/main.css')
        .toString();

    expect(cssContent).toContain('-webkit-animation-name');
    expect(cssContent).toContain('@-webkit-keyframes rotate');
});

test('Test the webpack dev server runs', async () => {
    const startServer = function() {
        return new Promise((reslove, reject) => {
            const server = spawn('webpack-dev-server');

            server.stdout.on('data', data => {
                if (/Compiled successfully./.test(data)) {
                    reslove(server);
                }
            });

            server.stderr.on('data', data => {
                reject(server);
            });

            server.on('close', code => {
                if (code > 0) {
                    reject(server);
                }
            });
        });
    };

    try {
        const server = await startServer();
        process.kill(server.pid);
    } catch (server) {
        process.kill(server.pid);
        fail('Webpack dev server did not finish successfully');
    }
});
