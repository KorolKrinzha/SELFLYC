import {merge} from "webpack-merge"
import commonConfig from "./webpack.config.js";




import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';

const prodConfig = {
    mode: "production",
  
 
  // Webpack 4 does not have a CSS minifier, although
  // Webpack 5 will likely come with one
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCssAssetsPlugin({})
    ]
  },

  plugins: [
   
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
}
export default merge(commonConfig, prodConfig); 
