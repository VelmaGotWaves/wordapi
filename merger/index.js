const fs = require('fs');
const path = require('path');

(() => {
  function checkFileExists(filePath) {
    try {
      fs.accessSync(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false; 
    }
  }
  
  if (!checkFileExists(path.join(__dirname, 'lib/groupdocs-merger-nodejs-24.2.jar'))) {
    console.warn('\x1b[33m%s\x1b[0m', `File groupdocs-merger-nodejs-24.2.jar not found in the lib directory.\nPlease navigate to the package directory:`);
    console.log('\n   cd node_modules/@groupdocs/groupdocs.merger\n');
    console.warn('\x1b[33m%s\x1b[0m', `Then download the JAR file using the command:`);
    console.log('\n   npm run postinstall\n');
    process.exit(0)
  }
  else {
    module.exports = require("./lib/groupdocs.merger");
  }
})()
