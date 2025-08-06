import { repos, script_path } from "./repos.js";

const pm2configuration = repos.map(repo => {
    return {
        name: repo.split("fe-")[1],
        //name: "portaal-fe",
        cwd: script_path,
        script: repo.split("fe-")[1] + ".js"
    };
});

export const apps = pm2configuration;
