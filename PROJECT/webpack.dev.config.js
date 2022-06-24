
import {merge} from "webpack-merge"
import commonConfig from "./webpack.config.js";







const devConfig = {
  
  mode: 'development',
  
  

}
export default merge(commonConfig, devConfig); 

