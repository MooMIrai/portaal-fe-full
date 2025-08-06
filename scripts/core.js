
const { execSync } = require("child_process");

const path = "/home/mverde/src/taal/portaal-fe-full/";
const repo = "portaal-fe-core";
const fullPath = path + repo;

execSync('cd ' + '"' + fullPath + '"' + ' && npm start', { windowsHide: true, stdio: "inherit" });
