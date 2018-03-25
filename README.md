# Fabric-Node-Canvas-Issues

- Ubuntu 16.04.3
- Nginx 1.10.3
- NodeJs version: 8.10.0
- Node-Canvas version 1.6.10
- Node FabricJs version: 2.2.2


Using some javascript/HTML client side code, I created some Fabric objects (Textbox and Image fabric derived custom classes) onto an HTML canvas. The client side test uses an HTML canvas having width=900 and height=510.

Next I save the HTML canvas into a Json file (named for example, project23.viprj) and I send this file to a running Ubuntu Nginx/Nodejs server application to create a PNG file.

In the server app I need to scale and reposition the objects of the incoming Json file to follow the new Node-Canvas canvas width (1920) and height (1080) assigned in the node app itself. After this in the nodejs app I create a PNG file with the modified objects.

The problem is that the generated PNG image (with scaled/repositioned objects) seems to have all the objects badly scaled and positioned and I don't understand why.

** In this situation both NodeJs versions of FabricJs and Node-Canvas are totally unusable for my scopes. **

![wrong](https://user-images.githubusercontent.com/20070559/37830450-85efd95a-2ea2-11e8-91db-e910ed8d5a6e.png)

Removing the scaling, I can see the objects are misplaced (wrong top/left)

![noscale](https://user-images.githubusercontent.com/20070559/37830486-a2b93478-2ea2-11e8-90f5-86b2178767c1.png)

In the client version of the code, using fabric 1.7.20 (so no nodeJS nor node-canvas, just javascript and HTML canvas), the PNG image is created with all the objects correctly scaled and positioned.

Maybe I'm assuming/doing  something wrong. Maybe node-canvas does something differently or needs something. I don't know.

If anyone has some idea about this issue please let me know.

### Files & Usage

#### Prerequisites
1. Install Node.JS LTS
2. Install process manager to easily run/manage apps: ```sudo npm install pm2 -g ```

#### The nodejs test applications in this repo
The repo has 2 different nodejs applications:

1. ftestjson - Creates the PNG from json data created client side containing scaled/repositioned objects
    The folder contains:
    - ftestfjson.js. The nodejs app
    - package.json. The used node-modules
    - testJson.html. This is served by the server to the client browser
    - fabfunction.js
    - the libs/ folder
    
2. ftestproject- Creates the PNG using the project23.viprj (on server) and scale/reposition objects server side
    The folder contains:
    - ftestfproject.js. The nodejs app
    - package.json. The used node-modules
    - testProject.html. This is served by the server to the client browser
    - fabfunction.js
    - project23.viprj - The project was created previously client side (canvas width:900, height:510)
    - the libs/ folder
   
   Enter each folder and install the required modules:
   
   ```cd <ftestjson>```
   
   ```npm install```
   
   ```cd <ftestproject>```
   
   ```npm install```
   
   ### Running apps: a sample.
   
   Configure your http server to answer http requests (see below).
   
   Change the current directory to one of the new folders created (for example, ftestjson) and run the node application:
   
   ```pm2 start ftestfjson.js```
   
   Start viewing logs of the app:
   
   ```pm2 logs ftestfjson```
   
   Start your browser and type the address of your Nginx server. In my case:
   
   ```http://192.168.248.132```
   
   This will show the testJson.html page. There are 2 HTML canvas, one with the original objects (top canvas) and another with the same objects scaled and repositioned (bottom). Json data is automatically generated using the bottom canvas and put in the <input> text, ready to be sent to the server app to generate the final PNG as it is.
   Clicking the button, the json data contained in the <input> text will be sent to the running application on the server.
   
If everything goes fine (see the app logs), in the ftestjson folder you'll see a new PNG file created. 
#### Open it to see the wrongly generated objects.
    

## My server uses Nginx 
If you use nginx you need to configure it to answer http requests.
Something like this:
```
upstream http_backend {
  server 127.0.0.1:44533;
}

server {
	listen 80;
	server_name 192.168.248.132; # your server IP
	root /var/www/html; # www root
	index index.html;

	location / {
		proxy_pass http://http_backend;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	        proxy_http_version 1.1;
	        proxy_set_header Upgrade $http_upgrade;
	        proxy_set_header Connection 'upgrade';
	        proxy_set_header Host $host;
	        proxy_cache_bypass $http_upgrade;
	}
}
```
