const path = require("path")

module.exports = {
    entry: "./assets/index.ts",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "webpack.bundle.js",
        libraryTarget: "var",
        library: "Bundle"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/i,
                use: [
                  "style-loader",
                  {
                      loader: "css-loader",
                      options: {
                          url: false
                      }
                  },
                  "sass-loader",
                ]
            },
            {
                test: /\.ts$/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.webpack.json"
                    }
                }]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/i,
                loader: "file-loader",
            }
        ]
    },
    resolve: {
        alias: {
            jquery: "jquery/src/jquery"
        },
        extensions: [
            "", ".js", ".ts", ".css", ".scss", ".png", ".svg"
        ],
        modules: ["node_modules"]
    }
}