
/**
 * THIS FILE DOES NOT GO INTO THE BUNDLE
 * IT IS A UTILITY FOR BUILDING DEVELOPMENT RUNS ON THE WEBPACK SERVER
 */

const si = require('systeminformation');
var jp = require('jsonpath');
var QRCode = require('qrcode')

/** this is mobiwekMenu\webpack_babel\commandLine-get-QRcode.js
 *  Run as: "node commandLine-get-QRcode.js ':3000/cars/chevy/malibu'"
 *  It also gets called by a webpack plugin in this folder. 
 *  It shows the current url as a qrcode. The address is the IP address, not localhost
 *  so a phone can read and go to the url.
 *  It uses the 'systeminformation' package to get the current IP
 *  It uses the 'jsonpath' package to parse output from above
 *  It uses the 'qrcode' package to generate a qr on the console using ascii
*/ 
// add these libaries to local development system
// BUT NOT TO THE PACKAGE LIBRARY TO BE PUBLISHED
// npm i systeminformation
// npm i jsonpath

// uses npm package systeminformation to get system info like processor, network info etc.
// Its used here to get the network interface handling Wi-Fi and get its IP address

// decide if I'm called as a command line utility or by webpack plugin:
var argsExceptNodeAndThisFile = process.argv.slice(2)

if (argsExceptNodeAndThisFile.length == 0) {
    console.log('use form:    node commandLine-get-QRcode.js \':3000/aa/bb.jpg\'')
    return;
}
// when called from a webpack plugin, arg[0] is 'serve'. If not, run doAllQR now.
if (argsExceptNodeAndThisFile[0] !== 'serve') doAllQR(argsExceptNodeAndThisFile[0]); 
// console.log('cccccccccc ' + argsExceptNodeAndThisFile[0])

function doAllQR(urlPath) {
    // console.log('vvvvvvvvvvvvvvvvvvvvvv ' + urlPath)
    //promises style - new since version 3
    // si.cpu()
    //   .then(data => console.log(data))
    //   .catch(error => console.error(error));

    // si.wifiConnections()
    //   .then(data => { 
    //       console.log(data) 
    //       console.log(data[0].iface)
    //   })
    //   .catch(error => console.error(error));
    
    var activeIpAddr
    // get my ip address. May be ethernet connection or Wi-Fi
    si.networkInterfaces().then(data => {  
        activeIpAddr = jp.query(data, "$..[?(@.iface=='Ethernet')]");
        if (activeIpAddr.length == 0) {
          // I'm not on ethernet, now try wifi
          activeIpAddr = jp.query(data, "$..[?(@.iface=='Wi-Fi')]");
        }
        activeIpAddr= activeIpAddr[0].ip4
        //                             ^^^ NO VEE NOT IPV4 JUST IP4 !!!!
        // now compose a url and show in console as a qr code
        theURL="http://" + activeIpAddr + urlPath; // ":3003/amhistory/benFranklin/shipDiagram?mwmfont=24.0px"
        console.log(theURL)
        QRCode.toString(theURL, {type:'terminal', small:true }, function (err, message) {
            console.log(message)
        })
      })
      .catch(error => console.error(error));

      /* jsonPathQuery = "$..*[?(@.mwmkey=='winslowHomerFogWarning')]"
                          ^ $ is root of tree
                          ^^ 2 dots is "Recursive descent" drill-down operator
                            ^ wildcard "anything within the tree having next thing" */
}

function abc() {
   console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
}
 
//export { doAllQR }

// these get exported to the webpack plugin
module.exports = { abc, doAllQR };
  


  
