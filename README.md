# classaidmaster
## install && serve client 
cd /client<br/>
npm install //on first time<br/>
npm start (default port:3000)<br/>
## deploy production client
npm run build<br/>
you will get /build floder for production<br/>
## install chat server
cd /server/chat<br/>
npm install //first time<br/>
npm start  (default port:5000)<br/>
## config chat server port on .env
PORT//For port<br/>
## install database server
cd /server/database<br/>
npm install //on first time<br/>
npm start (default port:3000)<br/>
## config database server port on .env
PORT //For port<br/>
TOKEN //For hash jwt<br/>
Img and Pdf on database server need to register and get value at https://cloudinary.com/ replace all 3 Key<br/>
CLOUD_NAME //get from  https://cloudinary.com/ <br/>
API_KEY  //get from  https://cloudinary.com/ <br/>
API_SECRET //get from  https://cloudinary.com/ <br/>
