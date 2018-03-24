# Fabric-Node-Canvas-Issues

Node-Canvas version 1.6.10 on Ubuntu 16.04.3
Node Fabric version: 2.2.2
NodeJS version: 8.10.0

Using some javascript/HTML client side code, I create some Fabric objects (Textbox and Image fabric derived custom classes) onto an HTML canvas.
The HTML canvas has width=900 and height=510 (for example).

Next I save the HTML canvas into a Json file (named for example, project23.viprj) and I send this file to a Ubuntu Nginx/Nodejs server application to create a PNG file.

On the server I need to scale and reposition the objects of the incoming Json file to follow the new node-canvas canvas width (1920) and height (1080) assigned in the node app. After this in the nodejs app I create a PNG file with the modified objects.

The problem is that the generated PNG image (with scaled/repositioned objects) seems to have all the objects badly scaled and positioned and I don't understand why.

![wrong](https://user-images.githubusercontent.com/20070559/37830450-85efd95a-2ea2-11e8-91db-e910ed8d5a6e.png)

Removing the scaling, I can see the objects are misplaced (wrong top/left)

![noscale](https://user-images.githubusercontent.com/20070559/37830486-a2b93478-2ea2-11e8-90f5-86b2178767c1.png)

In the browser version, using fabric 1.7.20 (so no nodeJS nor node-canvas, just javascript and HTML canvas), the PNG image is created with all the objects correctly scaled and positioned.

Maybe I'm assuming/doing  something wrong. Maybe node-canvas does something differently or needs something. I don't know.

If anyone has some idea about this issue please let me know.

### Files & Usage

#### Prerequisites
1. Install Node.JS LTS
2. Install node modules: express, cors, body-parser, socket.io, pm2 (to run apps)

#### The nodejs test applications in this repo
The repo has 2 different nodejs applications:

1. ftestfjson.js - Creates the PNG from a json string containing client side scaled/repositioned objects
    The app uses:
    - package.json-testjson. Rename it as package.json
    - testJson.html. This is sent by the server to the browser
    - fabfunction.js
    - the libs/ folder
    
   Create a folder under you user home and put everything in this new folder
    
2. ftestfproject.js - Creates the PNG using the project23.viprj (on server) and scale/reposition objects server side
    The app uses:
    - package.json-testproject. Rename it as package.json
    - testProject.html. This is sent by the server to the browser
    - fabfunction.js
    - the libs/ folder
    
   Create a folder under you user home and put everything in this new folder
    
### My server uses Nginx 
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
