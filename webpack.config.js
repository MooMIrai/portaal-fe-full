const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const deps = require("./package.json").dependencies;
const { FederatedTypesPlugin } = require("@module-federation/typescript");
const webpack = require("webpack");

const mfeConfig = (path, mode) => ({
  name: "reports",
  filename: "remoteEntry.js",
  remotes: {
    common:
      "common@" +
      path +
      (mode === "production" ? "/common" : "") +
      "/remoteEntry.js",
  },
  exposes: {
    "./Index": "./src/MfeInit",
    "./Routes": "./src/App",
  },
  shared: {
    ...deps,
    common: {
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
  require("dotenv").config({ path: "./.env." + argv.mode });
  return {
    devtool: "source-map",
    output: {
      publicPath: process.env.RELEASE_PATH,
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },
    devServer: {
      port: 3015,
      historyApiFallback: true,
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
          test: /\.(css|s[ac]ss)$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
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
      new ModuleFederationPlugin(mfeConfig(process.env.REMOTE_PATH, argv.mode)),
      //new FederatedTypesPlugin({ federationConfig: mfeConfig }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      new Dotenv({ path: "./.env." + argv.mode }),
    ],
  };
};
