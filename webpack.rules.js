const tsNameof = require("ts-nameof");

module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        getCustomTransformers: () => ({ before: [tsNameof] }),
      }
    }
  },
  {
    test: /\.s[ac]ss$/,
    use: [
      "style-loader",
      "css-loader",
      "sass-loader"
    ]
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: "@svgr/webpack"
      },
      {
        loader: "svg-url-loader",
        options: {
          limit: 10000
        }
      }
    ]
  }
];
