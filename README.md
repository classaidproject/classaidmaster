## classaidmaster
# install && serve client 
cd /client 
npm install //on first time
npm start (default port:3000)
# deploy production client
npm run build 
you will get /build floder for production
# install chat server
cd /server/chat
npm install //first time
npm start  (default port:5000)
# config chat server port on .env
PORT//For port
# install database server
cd /server/database
npm install //on first time
npm start (default port:3000)
# config database server port on .env
PORT //For port
TOKEN //For hash jwt
Img and Pdf on database server need to register and get value at https://cloudinary.com/ replace all 3 Key
CLOUD_NAME //get from  https://cloudinary.com/ 
API_KEY  //get from  https://cloudinary.com/ 
API_SECRET //get from  https://cloudinary.com/ 
