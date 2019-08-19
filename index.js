/**
 * Base imports
 */
const ManifestPlugin = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const path = require('path');

/**
 * Build base options
 */
const baseOptions = {
    src_path: path.resolve(process.cwd(), 'src'),
    dest_path: path.resolve(process.cwd(), 'dist'),
    public_path: '/',
    production: process.env.NODE_ENV === 'production',
    devServer: {
        contentBase: path.join(process.cwd(), 'public'),
        historyApiFallback: true,
        compress: true,
        port: 9000
    }
};

baseOptions.entry_point = [`${baseOptions.src_path}/index.tsx`];

/**
 * Global var for the main config
 */
let config = {};

/**
 * Global variable for the main config
 */
let webpackConfig = {};

/**
 * Global variable for the loaders as they will end up in a `oneOf` options
 */
const loaders = [];

/**
 * Css filename this get used more that once in the config
 */
let cssFilename = config.production
    ? 'css/[name].[chunkhash:8].css'
    : 'css/[name].css';

const initialize = _config => {
    /**
     * Reset the loaders when you initialize so we don't add previous loads to
     * the new config
     */
    loaders.length = 0;
    /**
     * Merge configs
     */
    config = Object.assign(baseOptions, _config);

    /**
     * Css filename this get used more that once in the config
     */
    cssFilename = config.production
        ? 'css/[name].[chunkhash:8].css'
        : 'css/[name].css';

    /**
     * Base loader for urls
     */
    loaders.push({
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: config.production
                ? 'media/[name].[hash:8].[ext]'
                : 'media/[name].[ext]'
        }
    });

    /**
     * Base loader for js
     */
    loaders.push({
        test: /\.(js|jsx|mjs)$/,
        exclude: /(node_modules|bower_components)/,
        include: config.src_path,
        loader: 'babel-loader'
    });

    /**
     * Main config
     */
    webpackConfig = {
        mode: config.production ? 'production' : 'development',
        bail: true,
        context: config.src_path,
        entry: config.entry_point,
        output: {
            path: config.dest_path,
            filename: config.production
                ? 'js/[name].[chunkhash:8].js'
                : 'js/[name].js',
            chunkFilename: config.production
                ? 'js/[name].[chunkhash:8].chunk.js'
                : 'js/[name].chunk.js',
            publicPath: config.public_path,
            devtoolModuleFilenameTemplate: info =>
                path
                    .relative(config.src_path, info.absoluteResourcePath)
                    .replace(/\\/g, '/')
        },
        devtool: !config.production ? 'source-map' : false,
        devServer: config.devServer,
        watchOptions: {
            ignored: /node_modules/,
            poll: true
        },
        optimization: {
            minimize: config.production,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2
                        },
                        mangle: {
                            safari10: true
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true
                        }
                    },
                    parallel: true,
                    cache: true,
                    sourceMap: false
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessor: require('cssnano'),
                    cssProcessorPluginOptions: {
                        preset: [
                            'default',
                            {discardComments: {removeAll: true}}
                        ]
                    }
                })
            ],
            splitChunks: {
                chunks: 'all',
                name: false
            }
        },
        resolve: {
            extensions: [
                '.js',
                '.jsx',
                '.json',
                '.ts',
                '.tsx',
                '.css',
                '.scss',
                '.less'
            ],
            alias: {}
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    loader: require.resolve('source-map-loader'),
                    enforce: 'pre',
                    include: config.src_path
                }
            ]
        },
        plugins: [
            new ManifestPlugin({
                fileName: 'asset-manifest.json'
            }),
            new ManifestPlugin({
                fileName: 'asset-manifest-required.json',
                filter(file) {
                    return file.isInitial;
                }
            })
        ],
        node: {
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty'
        }
    };
};

const typescript = () => {
    const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

    loaders.push({
        test: /\.(ts|tsx)$/,
        include: config.src_path,
        use: [
            {
                loader: 'babel-loader'
            },
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            }
        ]
    });

    webpackConfig.plugins.push(
        new ForkTsCheckerWebpackPlugin({
            tsconfig: path.resolve(process.cwd(), './tsconfig.json'),
            tslist: path.resolve(process.cwd(), './tslint.json'),
            async: false,
            useTypescriptIncrementalApi: true,
            memoryLimit: 4096
        })
    );
};

const styles = () => {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');

    const getLoader = ({test}) => {
        const _loaders = [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    sourceMap: !config.production
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    sourceMap: !config.production,
                    plugins: () => [
                        require('postcss-flexbugs-fixes'),
                        require('css-mqpacker'),
                        require('postcss-preset-env')({
                            autoprefixer: {
                                flexbox: 'no-2009'
                            },
                            stage: 3
                        })
                    ]
                }
            }
        ];

        if (test.test('.scss')) {
            _loaders.push({
                loader: 'sass-loader',
                options: {
                    sourceMap: !config.production
                }
            });
        } else if (test.test('.less')) {
            _loaders.push({
                loader: 'less-loader',
                options: {
                    sourceMap: !config.production
                }
            });
        }

        return {
            test: test,
            use: _loaders
        };
    };

    loaders.push(getLoader({test: /\.css$/}));
    loaders.push(getLoader({test: /\.scss$/}));
    loaders.push(getLoader({test: /\.less$/}));

    webpackConfig.plugins.push(
        new MiniCssExtractPlugin({
            filename: cssFilename
        })
    );
};

const html = template => {
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    let pluginOptions = {
        inject: true,
        template: template
    };

    if (config.production) {
        pluginOptions.minify = {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
        };
    }

    webpackConfig.plugins.push(new HtmlWebpackPlugin(pluginOptions));
};

const build = () => {
    /**
     * Clone the webpackConfig object
     */
    const _config = Object.assign({}, webpackConfig);

    /**
     * Add all the loader into a `oneOf` loader
     */
    loaders.push({
        loader: require.resolve('file-loader'),
        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
        options: {
            name: 'media/[name].[hash:8].[ext]'
        }
    });

    /**
     * Add the last loader as a catch all
     */
    _config.module.rules.push({oneOf: loaders.slice(0)});

    return _config;
};

module.exports = {
    build,
    initialize,
    styles,
    typescript,
    html
};
