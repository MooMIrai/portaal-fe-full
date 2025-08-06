import { existsSync, mkdirSync, writeFileSync } from "fs";
import { repos_path, script_path, repos } from "./repos.js";

for (const repo of repos) {
	const script = `
const { execSync } = require("child_process");

const path = "${repos_path}";
const repo = "${repo}";
const fullPath = path + repo;

execSync('cd ' + '"' + fullPath + '"' + ' && npm start', { windowsHide: true, stdio: "inherit" });
`;

	if (!existsSync(script_path)) {
		mkdirSync(script_path);
	}

	writeFileSync(script_path + "/" + repo.split("portaal-fe-")[1] + ".js", script, "utf-8");
	
}