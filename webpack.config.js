const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");
const deps = require("./package.json").dependencies;
const { FederatedTypesPlugin } = require("@module-federation/typescript");
const webpack = require("webpack");
const { Path } = require("@progress/kendo-drawing");

const mfeConfig = {
  name: "common",
  filename: "remoteEntry.js",
  remotes: {},
  exposes: {
    "./Drawer": "./src/components/Sidebar/component",
    "./Theme": "./src/components/Theme/component",
    "./Tab": "./src/components/Tab/component",
    "./Form": "./src/components/DynamicForm/component",
    "./Table": "./src/components/GridTable/component",
    "./Calendar": "./src/components/Calendar/component",
    "./CalendarMobile": "./src/components/CalendarMobile/component",
    "./InlineEditTable": "./src/components/InlineEditTable/component",
    "./Window": "./src/components/Window/component",
    "./Button": "./src/components/Button/component",
    "./CustomListView": "./src/components/CustomListView/component",
    "./AutoComplete": "./src/components/AutoComplete/component",
    "./CountrySelector": "./src/components/CountrySelector/component",

    "./services/AuthService": "./src/services/AuthService",
    "./services/BEService": "./src/services/BEService",
    "./services/BaseHTTPService": "./src/services/BaseHTTPService",

    "./providers/NotificationProvider":
      "./src/components/Notification/provider",

    "./hoc/Field": "./src/hoc/Field",
    "./hoc/AutoComplete": "./src/hoc/AutoComplete",
  },
  shared: {
    ...deps,
    react: {
      singleton: true,
      requiredVersion: deps.react,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: deps["react-dom"],
    },
  },
};

module.exports = (_, argv) => ({
  output: {
    publicPath: "http://localhost:3003/",
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  devServer: {
    port: 3003,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.json$/,
        type: "json",
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          },
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: false,
        defaultVendors: false,
        commons: false,
      },
    },
  },
  plugins: [
    new ModuleFederationPlugin(mfeConfig),
    //new FederatedTypesPlugin({ federationConfig: mfeConfig }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["bundle"],
    }),
    new Dotenv(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
});
