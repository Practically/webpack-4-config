
/**
 * Base imports
 */
const ManifestPlugin = require('webpack-manifest-plugin');
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
const cssFilename = config.production ? 'css/[name].[hash:8].css' : 'css/[name].css';

const initialize = (_config) => {
    /**
     * Merge configs
     */
    config = Object.assign(baseOptions, _config);

    /**
     * Base loader for urls
     */
    loaders.push({
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: config.production ? 'media/[name].[hash:8].[ext]' : 'media/[name].[ext]',
        },
    });

    /**
     * Base loader for js
     */
    loaders.push({
        test: /\.(js|jsx|mjs)$/,
        include: config.src_path,
        loader: 'babel-loader',
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
            filename: config.production ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
            chunkFilename: config.production ? 'js/[name].[chunkhash:8].chunk.js' : 'js/[name].chunk.js',
            publicPath: config.public_path,
            devtoolModuleFilenameTemplate: info =>
                path
                    .relative(config.src_path, info.absoluteResourcePath)
                    .replace(/\\/g, '/'),
        },
        devtool: !config.production ? 'source-map' : false,
        devServer: config.devServer,
        watchOptions: {
            ignored: /node_modules/,
            poll: true,
        },
        optimization: {
            runtimeChunk: {
                name: "manifest"
            },
            splitChunks: {
                chunks: 'all',
                name: 'vendor',
            },
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css', '.scss'],
            alias: {},
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /\.(js|jsx|mjs)$/,
                    loader: require.resolve('source-map-loader'),
                    enforce: 'pre',
                    include: config.src_path,
                }
            ]
        },
        plugins: [
            new ManifestPlugin({
                fileName: 'asset-manifest.json',
            }),
            new ManifestPlugin({
                fileName: 'asset-manifest-required.json',
                filter(file) {
                    return file.isInitial;
                }
            }),
        ],
        node: {
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty',
        },
    };
};

const typescript = () => {
    const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

    loaders.push({
        test: /\.(ts|tsx)$/,
        include: config.src_path,
        use: [
            {
                loader: 'babel-loader',
            },
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
            },
        ],
    })

    webpackConfig.plugins.push(
         new ForkTsCheckerWebpackPlugin({
            tsconfig: path.resolve(process.cwd(), './tsconfig.json'),
            tslist: path.resolve(process.cwd(), './tslint.json'),
            async: false,
            useTypescriptIncrementalApi: true,
            memoryLimit: 4096
         })
    );

}

const styles = ({scss} = {}) => {
    const ExtractTextPlugin = require('extract-text-webpack-plugin');

    const _loaders = [
        {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
                sourceMap: !config.production,
            },
        },
        // {
        //     loader: 'postcss-loader',
        //     options: {
        //         ident: 'postcss',
        //         sourceMap: !PRODUCTION,
        //         plugins: () => [
        //             // require('postcss-flexbugs-fixes'),
        //             autoprefixer({
        //                 browsers: [
        //                     '>1%',
        //                     'last 4 versions',
        //                     'Firefox ESR',
        //                     'not ie < 9',
        //                 ],
        //                 flexbox: 'no-2009',
        //             }),
        //         ],
        //     },
        // },
        //{
        //},

    ];

    /**
     * Add the scss loader if
     */
    if (scss) {
        _loaders.push({
            loader: 'sass-loader',
            options: {
                sourceMap: !config.production,
            },
        });
    }

    loaders.push({
        test: /\.(s*)css$/,
        loader: ExtractTextPlugin.extract(
            Object.assign(
                {
                    fallback: {
                        loader: 'style-loader',
                        options: {
                            hmr: false,
                        },
                    },
                    use: _loaders,
                },
                {
                    publicPath: Array(cssFilename.split('/').length).join('../')
                }
            )
        ),
    });

    webpackConfig.plugins.push(
        new ExtractTextPlugin({
            filename: cssFilename,
        })
    );
};

const html = (template) => {
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
            minifyURLs: true,
        };
    }

    webpackConfig.plugins.push(new HtmlWebpackPlugin(pluginOptions));
}

const build = () => {
    /**
     * Add the last loader as a catch all
     */
    const _loaders = loaders;
    _loaders.push({
        loader: require.resolve('file-loader'),
        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
        options: {
            name: 'media/[name].[hash:8].[ext]',
        },
    });

    /**
     * Add all the loader into a `oneOf` loader
     */
    const _config = webpackConfig;
    _config.module.rules.push({oneOf: _loaders});

    return _config;
};

module.exports = {
    build,
    initialize,
    styles,
    typescript,
    html,
};
