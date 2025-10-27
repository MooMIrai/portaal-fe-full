const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const deps = require("./package.json").dependencies;
const { FederatedTypesPlugin } = require("@module-federation/typescript");
const webpack = require("webpack");

const mfeConfig = (path, pathHr, mode) => ({
  name: "sales",
  filename: "remoteEntry.js",
  remotes: {
    common:
      "common@" +
      path +
      (mode === "production" ? "/common" : "") +
      "/remoteEntry.js",
    hr:
      "hr@" +
      pathHr +
      (mode === "production" ? "/hr" : "") +
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
      publicPath: 'sales/',
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },
    devServer: {
      port: 3008,
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
      new ModuleFederationPlugin(mfeConfig(process.env.REMOTE_PATH, process.env.REMOTE_PATH_HR, argv.mode)),
      //new FederatedTypesPlugin({ federationConfig: mfeConfig }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      new Dotenv({ path: "./.env." + argv.mode }),
    ],
  };
};
