rm -rf portaal-fe-*
repos=(
    "portaal-fe-auth"
    "portaal-fe-chatbot"
    "portaal-fe-common"
    "portaal-fe-core"
    "portaal-fe-hr"
    "portaal-fe-lookUps"
    "portaal-fe-notifications"
    "portaal-fe-personalarea"
    "portaal-fe-recruiting"
    "portaal-fe-reports"
    "portaal-fe-sales"
    "portaal-fe-stock"
)

# Base SSH URL for Azure DevOps
base_url="taal@vs-ssh.visualstudio.com:v3/taal/Portaal.js/"

# Loop to clone each repository
for repo in "${repos[@]}"
do
    git clone -b production "${base_url}${repo}"

done
