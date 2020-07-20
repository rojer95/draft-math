const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: ["./demo/index.tsx"],
    vendor: ["react", "react-dom"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].bundle.js",
  },
  devtool: "source-map",
  devServer: {
    port: 8000,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node-modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: false,
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { modules: true, importLoaders: 1 },
          },
          "less-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              name: "assets/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: "./demo/index.html",
    }),
  ],
};
