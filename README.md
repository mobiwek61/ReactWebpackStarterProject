

This demo project uses a custom webpack configuration, specifically setup for React.   
**I totally recommend ignoring any details about webpack; just use it as described below.**  
To run, cd to this folder and in a git-bash (on windows) window:  
  ```
  # reads package.json and loads node_modules folder with packages.
  npm install 
  # run the app using preconfigured setup.
  ./runWebpackSrv 
  # a QR code of the app should appear in the commandline window
  # and the app should popup in a browser
  # Any edits get auto-reloaded in real time.
  ```

#### Folder webpackUtils:
- has webpack plugins and supporting node.js code. This plugin displays the url as a QR code for display/debugging of app on a mobile device.

### What is going on with webpack?  
- Webpack is used here as a command line utility. It is not part of this node project. It appears in package.json and is installed in node_modules so it may be run from the command line. **It does these things:**  
  - it's http server hosts the app during development
  - it creates a bundle.js for development, served by the http server and later an optimized bundle.js for deploying the web app on github pages, or an nginx server for example.
  - it monitors source files and auto-builds during development.  

  **webpack.config\*.js gets read for configuration** and directs webpack's behavior:  
- The webpack server serves **index.html**. On the browser, this requests the **bundle file** above inside a ```<script>``` tag.
  - This bundle file runs any javascript not inside a function.   
    In this case, lines from **index.js** (now inside the bundle) get run.  
    Specifically the lines
     ```
     const root = ReactDOM.createRoot(document.getElementById('root'));
     root.render(<>here is React JSX content</>)
     ```
    setup React.js and get it running. Typically above JSX invokes an external React module which does the real work.
- Note that React.js is run only on the browser and nothing gets run by the webpack server, except to serve up files.
- **404 error**. When a react page gets reloaded, the server looks for the URL path, doesn't see a file there and returns a 404 error.  The line ```historyApiFallback: true,``` causes the webpack server to revert to index.html and fixes this problem because control gets returned to the React router.    
- A browser preloaded to a specific port and url is started by the line   
```open: { target: ['/snow'],   .....```  
- This line calls a custom plugin to display the url as an IP address (not localhost) in a QR code on the console:   
```new MyWebpackPlugin_shows_URL_as_qrcode({ options: true, urlpath: ':3003/x15/x15?mwmfont=24.7px' })],```  
- Beware of the **duplicate React.js problem**. When running a node/React app directly or from webpack there must be only one node_modules in the run folder hierarchy. If more than one node_modules is present ie: run folder and 2 levels up, React fails with a vague and unrelated error message, typically something about useEffect not allowed.
### Other unimportant details:  
- above script uses line ```node ./node_modules/webpack/bin/webpack serve -c ./webpack.config_devServer.js``` to run webpack. Full path is specified because webpack was installed as locally. It can be installed globally; the command will not need the full path but version conflict can happen and is hard to diagnose.  
