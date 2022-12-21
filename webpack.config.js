const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (props, {mode}) => {
    const options = {
        entry: './src/index.js',
    
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'main.[contenthash].js',
            assetModuleFilename: 'assets/images/[hash][ext][query]'
        },
    
        resolve: {
            extensions: ['.js']
        },
    
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.s?css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(woff|woff2)$/i,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: "application/font-woff",
                            name: "[name][contenthash].[ext]",
                            outputPath: "./assets/fonts/",
                            publicPath: "./assets/fonts/",
                            esModule: false
                        }
                    }
                }
            ]
        },
    
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].[contenthash].css',
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: './public/index.html',
                filename: './index.html'
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'src', 'assets/images'),
                        to: "assets/images"
                    }
                ]
            }),
            new CleanWebpackPlugin(),
        ],
    }

    if (mode === 'development') {
        options.devServer = {
            static: path.resolve(__dirname, 'dist'),
            compress: true,
            historyApiFallback: true,
            port:3006
        }
    } else {
        options.optimization = {
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin()
            ]
        }
    }

    return options;
}
