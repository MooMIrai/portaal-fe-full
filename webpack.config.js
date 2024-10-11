const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");
const deps = require("./package.json").dependencies;
const { FederatedTypesPlugin } = require("@module-federation/typescript");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const mfeConfig = (path, mode) => {
  let remotes = {
    common: "common@http://localhost:3003/remoteEntry.js",
    auth: "auth@http://localhost:3006/remoteEntry.js",
    lookups: "lookups@http://localhost:3005/remoteEntry.js",
    sales: "sales@http://localhost:3008/remoteEntry.js",
    hr: "hr@http://localhost:3009/remoteEntry.js",
  };
  if (mode === "production") {
    remotes = {
      common: "common@common/remoteEntry.js",
      auth: "auth@auth/remoteEntry.js",
      lookups: "lookups@lookups/remoteEntry.js",
      sales: "sales@sales/remoteEntry.js",
      hr: "hr@hr/remoteEntry.js",
      recruiting: "recruiting@recruiting/remoteEntry.js",
    };
  }
  return {
    name: "core",
    filename: "core.js",
    remotes: remotes,
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
};
module.exports = (_, argv) => {
  require("dotenv").config({ path: "./.env." + argv.mode });

  return {
    entry: "./src/index",
    mode: argv.mode,
    output: {
      publicPath: process.env.RELEASE_PATH,
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },
    devServer: {
      port: 3000,
      historyApiFallback: true,
    },
    devtool: "source-map",
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
    plugins: [
      new ModuleFederationPlugin(mfeConfig(process.env.REMOTE_PATH, argv.mode)),
      //new FederatedTypesPlugin({ federationConfig: mfeConfig }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      new Dotenv({ path: "./.env." + argv.mode }),
      new CopyPlugin({
        patterns: [{ from: "public", to: "." }],
      }),
    ],

    //devtool: "source-map",
  };
};
