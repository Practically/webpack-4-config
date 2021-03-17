<div align="center">
    <h1>Practically Webpack 4 Config</h1>
    <p><strong>An abstraction api for generating webpack configurations.</strong></p>
</div>

## Installation

```js
yarn add @practically/webpack-4-config
```

## Usage

Once installed you can create a base `webpack.config.js` with the following
contents. The `initialize` function must be the first function you call and
`build` must the last.

```js
const c = require('@practically/webpack-4-config');

c.initialize();

module.exports = c.build();
```

### Initialization

The first function you must call is `initialize` the will start off the
generation of the config. You can pass an object into the function to
customize your config.

| Option      | Default  | Description                                                                                      |
| ----------- | -------- | ------------------------------------------------------------------------------------------------ |
| src_path    | ./src    | The base path for all of the assets                                                              |
| dest_path   | ./dist   | The path where you compiled asses will be put                                                    |
| public_path | /        | The path where you assets are going to be saved. This is used for the urls in the manifest files |
| production  | NODE_ENV | This will not generally need to be set as it set from the node environment                       |

### Babel

For babel you can add a `.babelrc` to your project. Below is an really basic
config.

```json
// .babelrc
{
    "presets": ["env"]
}
```

### CSS

To use css you can call the `styles` function. Note this has to be called after
`initialize`

```js
const c = require('@practically/webpack-4-config');

c.initialize();
c.styles();

module.exports = c.build();
```

### SCSS

For scss make shore you have the called the styles function and the scss
loader will have been added.

```js
c.styles();
```

### LESS

For less make shore you have the called the styles function and the less
loader will have been added.

```js
c.styles();
```

### Typescript

To use typescript call the `typescript` function. You will also need to
configure your `tsconfig.json`. You can also add a `tslint.json` to the root of
your project if you want linting.

```js
// webpack.config.js
c.typescript();
```

### Html

With the html webpack plugin you can create a SPA and add inject all of you
chunked scripts into the html. Simply call the `html` function passing in the
path to your `index.html`

```js
// webpack.config.js
c.html('path/to/index.html');
```

## Scripts

To compile your app you can call `webpack` from you terminal to build. You can
set the `NODE_ENV` to provide the environment in witch to build in, valid
options are `production` and `development`. Below is an example scripts config
you can put into your `package.json`.

```json
"scripts": {
    "start": "NODE_ENV=development webpack s",
    "watch": "NODE_ENV=development webpack --watch",
    "dev": "NODE_ENV=development webpack",
    "development": "NODE_ENV=development webpack",
    "prod": "NODE_ENV=production webpack",
    "production": "NODE_ENV=production webpack"
}
```

Once you have added the scripts to your `package.json` you can run `yarn dev`
to run the `dev` script.

## Advanced Configuration

There are two ways you can further customize your webpack config. The first is
to simply set properties after you have called the `build` function.

```js
const config = c.build();

config.plugins.push(new WepackPlugin());

module.exports = config;
```

Setting properties is good for the small and minor changes but for even more
customization you can use
[webpack-merge](https://github.com/survivejs/webpack-merge). This package dose
not get included so you will need to install it yourself. Once installed you
can merge your defined config with the one generated but this package.

```js
const path = require('path');
const merge = require('webpack-merge');
const c = require('@practically/webpack-4-config');

c.initialize();

module.exports = merge(c.build(), {
    mode: 'production',
    bail: false,
    context: path.resolve(__dirname, 'client'),
    entry: package.resolve(__dirname, 'client', 'index.jsx')
});
```

## Credits

This package is created and maintained by [Practically.io](https://practically.io/)
