
/**  File webpack.config_devServer.js
 Run webpack with this command:
 node node_modules/webpack/bin/webpack serve -c ./webpack.config_devServer.js 
 What it does: pack all js files into a single minified .js file and run a development HTTP server.

 Sequence of events:
 - The webpack HTTP server serves up index.html which has <script src="/bundle_localdev.js" 
   The script runs all javascript in the bundle not inside functions; this includes index.js which
   starts up Reactjs and invokes React components in the bundle.
   NOTE: when webpack is run in "serve" mode, the bundle.js file is NOT physically created; its virtual.

 This is a javascript file which exports a big JSON object which webpack imports and uses to configure itself. 

 ref: "https://webpack.js.org/configuration/module" 
 Note that webpack is used as a command line utility and is NOT part of the bundle or the project.
 If webpack is installed globally "npm install -g webpack" use the "webpack" command. 
 I don't do it, instead I run node manually from node_modules as above. This avoid version conflicts.
*/

const path = require('path');  // npm package used below

// To include my webpack plugin. It displays an ascii qr code in the window where webpack gets run, showing the url
// of the website. Enables quick mobile viewing of the app. Not required I did it for fun.
var MyWebpackPlugin_shows_URL_as_qrcode = require('./webpackUtils/MyWebpackPlugin_shows_URL_as_qrcode');

module.exports = 
{
  // entry means "start dependency graph at this file", which follows casading import()'s (see the file)
  entry: ['./src/index.js'],  // entry: ['./aaa.js', '../bbb.js'],

  optimization: {
    // NOT ME >>    minimize: true // human readable if minimize if false
    minimize: false
  },
  devtool: 'eval-source-map', // 'eval-cheap-source-map',  // to get chrome debugger line number in code to line up
  mode: 'development',  // development or production
  // resolve is a fancy way of saying "look here for files to build graph". Extensions says use .js .jsx 
  resolve: { 
    extensions: ['.js', '.jsx']
  },
  // setup where to put minified output file "the bundle", and any assets like jpegs. 
  output: {
    path: path.resolve(__dirname, 'zzzzz'),  // seems to be ignored in dev mode, where physical file not created

    filename: 'bundle_webpackServer.js',
    // ref: https://webpack.js.org/configuration/output/#outputlibrarytype
    // type:'window' must mean "make library available via the DOM window object"
    library: { name: 'webPackLibraryVisibleFromDomWindowObject' , type: 'window' } 
    // type: 'commonjs2' works on client but not local server 
    // ?? library: { type: 'commonjs2' } 
  },

  // plugin here is a way to run javascript code during build
  plugins: [
    // see notes above
    new MyWebpackPlugin_shows_URL_as_qrcode({ options: true, urlpath: ':3003/sand' })],

  // modules are chunks of processing to do. The "use" tag invokes npm packages to do various processing.
  module: {
    rules: [  // here's the first rule in the array of rules
      { // added for sass, the css stylesheet thing
        test: /\.(scss|sass)$/,
        // npm i sass-loader -D   ... installs and shows up in package.json as a dev-dependency (not part of project)        
        use: [ 'style-loader',  'css-loader', 'sass-loader' ] 
      },
      { // feeds files to babel, the JSX transpiler. It converts JSX to plain javascript. ref:https://webpack.js.org/configuration/module/#ruletest 
        test: /\.(js|jsx|ts|tsx)$/,   
        // not needed... include: [  path.resolve(__dirname, "src/zzz"), path.resolve(__dirname, "src/abc") ],
        exclude: /node_modules/, // dont send these hundreds of files to babel! Client will download these itself upon "npm i"
        use: {  // ref: https://webpack.js.org/configuration/module/#ruleuse
            loader: 'babel-loader', // node_modules/babel-loader/lib runs something here ...?
            // NOTE: options can be left out but you need a .babelrc with same presets.
            //       If you leave out both things, get fail without a description of whats wrong
            // 1/2024 added @babel/preset-typescript for typescript and ts 
            options: { 
              "presets": ["@babel/preset-typescript", "@babel/preset-env", "@babel/preset-react"]
              // for "optionalChainingAssign" error, but not needed. See comment in source ,"plugins": [ "@babel/plugin-proposal-optional-chaining" ]
            }
        }, 
      }, 
      {  // this rule eats .css files
        test: /\.css$/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
        ]
      }

    ]
  },
  
  devServer: {  // ref: https://webpack.js.org/configuration/dev-server/#devserverclient
    // https: true, // location on browser is denied if not https
    // allowedHosts: ['.host.com', 'host2.com'],
    // OK for only one static dir...    static: path.join(__dirname, './publicProj/npmjs_com/bundle-publish-public'), // originally dist-webpack
    static: [
      // specify folder for webpack server to use as root to serve from
      // also index.html should go here, which has tags to invoke bundle
      path.join(__dirname, 'public'),  // for jpegs
    ],
    // devServer.historyApiFallback if true returns index.html instead of 404. 
    // I think React.js needs this because the webpack server doesn't know how to handle http://zzz/aa/bb/cc
    // and it gives a 404. Instead, it passes it to index.html which hands it to the React router 
    // which knows how to route the request by path.
    historyApiFallback: true, 
    compress: true,
    port: 3003, 
    host: 'local-ip', // makes open.target go to the IP, not localhost. Good if app has QR code.
    // https://webpack.js.org/configuration/dev-server/#devserveropen
    // open: false, //true, // Tells dev-server to open the browser
    open: { target: ['/sand'], // opens chrome to specific url
            app: { name: 'msedge' // microsoft edge
            // app: { name: 'chrome'
            // infinite tabs!!   , arguments: ' --auto-open-devtools-for-tabs' 
          }},
    client: {
      logging: 'error', //'info', // set log level
      overlay: {
        errors: true,
        // if warnings true, page in browser starts with a warning popup, its just warnings but looks like a crash!
        warnings: false, 
        runtimeErrors: true,
      },
    },
  }
};

// THE EXTERNALS SECTION, NOT NEEDED FOR DEVELOPMENT BUILD
// the 'npx create-react-app my-app' thing uses HtmlWebpackPlugin to insert 
  // something like ' <script src="/bundle_webpackServer.js"></script>' into index.html before running so
  // so the coder does not have to. I didn't know why the script tab was not needed and thought
  // I was doing something wrong so searched how they did it and found this.
  // Because this confused me, I put script tag into index.html instead!
  // Leave this comment here because it took hours to find how they did it.
  // plugins: [ new HtmlWebpackPlugin({
  //     //inject: true,   title: 'zzbb', // template: 'bundle_webpackServer.js'
  //     template: './webpackServerDevApp/index.js' })],
  
  // *********************************************************************************************************
  // *** "EXTERNALS" FIXES ERROR ON CLIENT: WHEN REACT CONTROL IMPORTED FROM BUNDLE CALLS useEffect(), GET ***
  // ***  ERROR  MESSAGE ABOUT DUPLICATE COPIES OF REACT. BELOW ENTRY SAYS DONT BUNDLE REACT, JUST USE     ***
  // ***  CLIENT'S COPY OF REACT FOR THE GIVEN LIBRARY/TYPE ENTRIES.                                       ***
  // *** [OK for npmjs publish but not local bundle or wedpack development server]                                                       ***
  // *** https://webpack.js.org/configuration/externals/                                                   ***
  // *** "The externals configuration option provides a way of excluding dependencies from the output      ***
  // *** bundles. Instead, the created bundle relies on that dependency to be present in the consumer's    ***
  // *** (any end-user application) environment. ..."                                                      ***
  // *********************************************************************************************************
  /* 
    this is needed for publishing a bundle to npmjs, but not for
    deploying a whole react app to nginx or github pages.
    That's because it needs react.js of its own; there is no react app importing t
    the bundle; an app which already has its own react. 
  */
  // externals: {        
  //   react: {          
  //       commonjs: 'react',          
  //       commonjs2: 'react',          
  //       amd: 'React',          
  //       root: 'React',      
  //   },      
  //   'react-dom': {          
  //       commonjs: 'react-dom',          
  //       commonjs2: 'react-dom',          
  //       amd: 'ReactDOM',          
  //       root: 'ReactDOM',      
  //   },  
  // },

