const { spawn } = require("child_process");
const path = require("path");

const cwd = path.resolve(__dirname, "../portaal-fe-dashboard-editor");

const npmScript = spawn("npm", ["run", "start"], {
  cwd,
  shell: true,
});

npmScript.stdout.on("data", (data) => {
  console.log(`[Dashboard Editor]: ${data}`);
});

npmScript.stderr.on("data", (data) => {
  console.error(`[Dashboard Editor Error]: ${data}`);
});

npmScript.on("close", (code) => {
  console.log(`[Dashboard Editor] process exited with code ${code}`);
});