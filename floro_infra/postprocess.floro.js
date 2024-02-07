// post process scripts
require("./postscripts/text/text-postprocess");

const fs = require('fs');
const path = require('path');

const metaFileJSON = require('./meta.floro.json');


fs.writeFileSync(
  path.join(__dirname, "./floro_modules/meta.floro.js"),
  "export default " + JSON.stringify(metaFileJSON, null, 2),
  "utf-8"
);