const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  contentBase: config.output.path,
  hot: true,
  historyApiFallback: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
}).listen(3000, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});
