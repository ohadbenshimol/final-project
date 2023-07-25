const nrwlConfig = require("@nrwl/react/plugins/webpack.js");
const webpack = require('webpack');
const { merge } = require('webpack-merge');

module.exports = (config, context) => {
    nrwlConfig(config, context); // Pass both config and context
    return merge(config, {
        plugins: [
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            })
        ],
        resolve: {
                        alias: {
                            'crypto': 'crypto-browserify',
                        },
                        fallback:{
                            "stream": false ,
                            "querystring": false ,
                            "path": false ,
                            "os": false,
                            "https":false,
                            "http": false,
                                "fs": false,
                                "child_process": false,
                                "http2": false
                        }
                    }
    });
};


// module.exports = composePlugins(
//     withNx(),
//     withReact(),
//     (config, { options, context }) => {
//       console.log(getWebpackConfig(config));
//     return {
//         ...config,
//         resolve: {
//             ...config.resolve,
//             alias: {
//                 ...config.resolve.alias,
//                 'crypto': 'crypto-browserify',
//             },
//             fallback:{
//                 ...config.resolve.fallback,
//                 "stream": false ,
//                 "querystring": false 
//             }
//         },
//         plugins: [
//             ...config.plugins,
//             new webpack.ProvidePlugin({
//                 process: 'process/browser',
//             }),
//         ],
//     }
 

     
//   }
// );