const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const deps = require("./package.json").dependencies;
const webpack = require("webpack");
const { FederatedTypesPlugin } = require("@module-federation/typescript");

const mfeConfig = (path, mode) => ({
  name: "dashboardeditor",
  filename: "remoteEntry.js",
  remotes: {
    common:
      "common@" +
      path +
      (mode === "production" ? "/common" : "") +
      "/remoteEntry.js",
    dashboard:
      "dashboard@" +
      path +
      (mode === "production" ? "/dashboard" : "") +
      "/remoteEntry.js",
  },
  exposes: {
    "./Index": "./src/MfeInit",
    "./Routes": "./src/VisibleRoutes",
    "./WidgetEditor": "./src/components/WidgetConfigurator/component",
    "./WidgetTypeSelector": "./src/components/WidgetTypeSelector/component",
    "./WidgetPreview": "./src/components/WidgetPreview/component",
  },
  shared: {
    ...deps,
    common: {
      singleton: true,
    },
    dashboard: {
      singleton: true,
    },
    react: {
      singleton: true,
      requiredVersion: deps.react,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: deps["react-dom"],
    },
  },
});

module.exports = (_, argv) => {
  const dotenvPath = argv.mode === 'development' ? './.env.development' : './.env.production';
  require("dotenv").config({ path: dotenvPath });
  return {
    devtool: "source-map",
    output: {
      publicPath: process.env.RELEASE_PATH || "auto",
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },
    devServer: {
      port: 3022,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    watchOptions: {
      ignored: /node_modules/,
      poll: 1000,
      aggregateTimeout: 300
    },
    module: {
      rules: [
        {
          test: /\.m?js/,
          type: "javascript/auto",
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    optimization: {
      minimizer: [
        '...',
        new CssMinimizerPlugin()
      ],
      minimize: true
    },
    plugins: [
      new ModuleFederationPlugin(mfeConfig(process.env.REMOTE_PATH || "http://localhost:3003", argv.mode)),
      //new FederatedTypesPlugin({ federationConfig: mfeConfig }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      new Dotenv({ path: dotenvPath }),
    ],
  };
};