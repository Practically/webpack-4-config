# Practically Webpack 4 Config

This is base package for a webpack 4 config for bundling web apps.

## Installation

~~~ js
yarn add practically-webpack-4-config
~~~

## Usage

Ones installed you can create a base `webpack.config.js` with the following
contents

~~~ js
const c = require('practically-webpack-4-config');

c.initialize();

module.exports = c.build();
~~~

## Babel

For babel you can add a `.babelrc` to your project, and then you can add all of
the packages you need and configure bebel per you project. Below you can add
`babel-preset-env` to your `package.json` and add the preset to the env preset
to `.babelrc`

~~~ json
// package.json
...
"dependencies": {
    "babel-preset-env": "^1.6.0"
},
...
~~~

~~~ json
// .babelrc
{
    presets: ['env']
}
~~~

## CSS

To use css you can call the `styles` function. Note this has to be called after
`initialize`

~~~ js
const c = require('practically-webpack-4-config');

c.initialize();
c.styles();

module.exports = c.build();
~~~

You will also need to add the style loader to your package.json

~~~ json
// package.json
...
"dependencies": {
    "style-loader": "^2.1.0"
},
...
~~~

## SCSS

For scss make shore you have the called the styles function and the scss
loader will have been added. You will also need to add some packages to your
`package.json`

~~~ js
c.styles();
~~~

~~~ json
// package.json
...
"dependencies": {
    "css-loader": "^2.1.0",
    "node-sass": "^4.11.0",
    "sass-loader": "^7.1.0"
},
...
~~~

## LESS

For less make shore you have the called the styles function and the less
loader will have been added. You will also need to add some packages to your
`package.json`

~~~ js
c.styles();
~~~

~~~ json
// package.json
"dependencies": {
    "css-loader": "^2.1.0",
    "less": "^3.9.0",
    "less-loader": "^4.1.0",
},
~~~

## Typescript

To use typescript in your project you can add the following package to your
`package.json` you will also need to configure your `tsconfig.json` and
`tslint.json`

~~~ js
// webpack.config.js
c.typescript();
~~~

~~~ json
// package.json
...
"dependencies": {
    "fork-ts-checker-webpack-plugin": "^0.5.2"
    "ts-loader": "^5.3.3",
    "tslint": "^5.12.1",
    "typescript": "^3.2.4",
},
...
~~~

## Html

With the html webpack plugin you can create a SPA and add inject all of you
chunked scripts into the html.

~~~ js
// webpack.config.js
c.html('path/to/index.html');
~~~

~~~ json
// package.json
...
"dependencies": {
    "html-webpack-plugin": "^3.2.0",
}
...
~~~
