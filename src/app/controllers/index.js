const fs = require('fs');
const path = require('path');

module.exports = app => {
   // import and incude path in all files with . not
   //in init and diferent index.js and export all controllers

   fs
    .readdirSync(__dirname)
    .filter(file => ((file.indexOf('.')) !==0 && (file !== "index.js")))
    .forEach(file => require(path.resolve(__dirname, file))(app));
};