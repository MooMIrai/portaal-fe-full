# Rimuove la cartella www se esiste e la ricrea
rm -rf www
mkdir www

# Copia ricorsiva dei contenuti dalle varie cartelle dist nelle rispettive cartelle in www

mkdir ./www/auth
mkdir ./www/common
mkdir ./www/hr
mkdir ./www/lookups
mkdir ./www/recruiting
mkdir ./www/sales
mkdir ./www/personalarea
mkdir ./www/stock
mkdir ./www/notification
mkdir ./www/reports
mkdir ./www/chatbot

cp -r ./portaal-fe-auth/dist/* ./www/auth/
cp -r ./portaal-fe-common/dist/* ./www/common/
cp -r ./portaal-fe-core/dist/* ./www/
cp -r ./portaal-fe-hr/dist/* ./www/hr/
cp -r ./portaal-fe-lookUps/dist/* ./www/lookups/
cp -r ./portaal-fe-recruiting/dist/* ./www/recruiting/
cp -r ./portaal-fe-sales/dist/* ./www/sales/
cp -r ./portaal-fe-personalarea/dist/* ./www/personalarea/
cp -r ./portaal-fe-stock/dist/* ./www/stock
cp -r ./portaal-fe-notifications/dist/* ./www/notification
cp -r ./portaal-fe-reports/dist/* ./www/reports
cp -r ./portaal-fe-chatbot/dist/* ./www/chatbot