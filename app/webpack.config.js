let path = require("path");

module.exports = {
  context: path.join(__dirname, "/client"),

  entry: {
      main: "./routes"
  },
  output: {
    path: "./public/js/",
    filename: 'main.js',
    publicPath: '/js/'
  },

  module: {
    loaders: [
      { test: /\.js$/, 
        exclude: /node_modules/, 
        loader: 'babel?presets[]=react,presets[]=es2015,presets[]=stage-0',

      }
    ]
  }
}
