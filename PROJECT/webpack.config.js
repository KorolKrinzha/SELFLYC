import { join, resolve, dirname } from "path";

const commonConfig = {
  entry: {
    index: './src/js/index.js',
    sign: './src/js/sign.js',
    login: './src/js/login.js',
    render: './src/js/render.js',
    scoreboard: './src/js/scoreboard',
    score: './src/js/score',
    userscore: './src/js/userscore'

    


  },
  output: {
    path: join(resolve(dirname('')), 'dist'),
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  
  module: {
    rules: [

      {
       
        test: /\.html$/,
        use: [{
          loader: "html-loader",
        }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        
        test: /\.s[ac]ss$/i,
        use: ['style-loader',
      'css-loader',
      'sass-loader',
    ],
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2|otf)$/,
        use:{
        loader: 'file-loader',
        options: {
            name: 'dist/[name].[hash].[ext]'
       }
      }

      },
    ]
  },

}

export default commonConfig;