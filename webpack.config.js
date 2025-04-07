const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");
const deps = require("./package.json").dependencies;
const { FederatedTypesPlugin } = require("@module-federation/typescript");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const PrebuildPlugin = require("prebuild-webpack-plugin");
const path = require('path')
const fs = require('fs');

const mfeConfig = (path, mode) => {
  let remotes = {
    common: "common@http://localhost:3003/remoteEntry.js",
    auth: "auth@http://localhost:3006/remoteEntry.js",
    lookups: "lookups@http://localhost:3005/remoteEntry.js",
    sales: "sales@http://localhost:3008/remoteEntry.js",
    hr: "hr@http://localhost:3009/remoteEntry.js",
    recruiting: "recruiting@http://localhost:3011/remoteEntry.js",
    stock:"stock@http://localhost:3012/remoteEntry.js",
    notification:"notification@http://localhost:3013/remoteEntry.js",
    reports:"reports@http://localhost:3015/remoteEntry.js",
    chatbot:"chatbot@http://localhost:3018/remoteEntry.js",
  };
  if (mode === "production") {
    remotes = {
      common: "common@common/remoteEntry.js",
      auth: "auth@auth/remoteEntry.js",
      lookups: "lookups@lookups/remoteEntry.js",
      sales: "sales@sales/remoteEntry.js",
      hr: "hr@hr/remoteEntry.js",
      recruiting: "recruiting@recruiting/remoteEntry.js",
      stock:"stock@stock/remoteEntry.js",
      notification:"notification@notification/remoteEntry.js",
      reports:"reports@reports/remoteEntry.js",
      chatbot:"chatbot@chatbot/remoteEntry.js"
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
  require("dotenv").config({ path: "./.env." + argv.mode ,processEnv:{
    mfe:mfeConfig.remotes
  }});

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
      new PrebuildPlugin({
        build: (compiler, compilation, matchedFiles) => {
          const filePath = path.resolve(__dirname, 'src/mfeConfig.ts');
          const menuToImportString = Object.keys(mfeConfig(process.env.REMOTE_PATH, argv.mode).remotes)
          .filter(k=>k!='common' /*&& k!='auth'*/)
          .map(k=>'import("' +k+'/Index")');
          const routesToImport = Object.keys(mfeConfig(process.env.REMOTE_PATH, argv.mode).remotes)
          .filter(k=>k!='common' && k!='auth')
          .map(k=>'React.lazy(() => import("' +k+'/Routes"))');

          let textFile = `
          import React from 'react';

          export const menuToImport = [
            ${menuToImportString.join(',\n\t\t\t')}
          ];
          
          export const routesToImport = [
             React.lazy(()=> import("auth/VisibleRoutes")),
             ${routesToImport.join(',\n\t\t\t')}
          ];

          export const routesLoginToImport = [
            React.lazy(() => import("auth/Routes"))
          ];
          `;
          fs.writeFileSync(filePath, textFile, 'utf8'); // Scrive il file

          console.log('File TSX generato dinamicamente!');
          // function that runs on compile, as well as when dev mode starts for the first time only
        },
      }),
      new ModuleFederationPlugin(mfeConfig(process.env.REMOTE_PATH, argv.mode)),
      //new FederatedTypesPlugin({ federationConfig: mfeConfig }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      new Dotenv({ path: "./.env." + argv.mode }),
      new webpack.DefinePlugin({
        'process.env.REMOTES_MFE': JSON.stringify(Object.keys(mfeConfig(process.env.REMOTE_PATH, argv.mode).remotes)),
      }),
      new CopyPlugin({
        patterns: [{ from: "public", to: "." }],
      }),
    ],

    //devtool: "source-map",
  };
};
