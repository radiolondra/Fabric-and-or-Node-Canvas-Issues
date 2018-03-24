# Fabric-Node-Canvas-Issues

Node-Canvas version 1.6.10 on Ubuntu 16.04
Node Fabric version: 2.2.2
NodeJS version: 8.10.0

I need to scale the objects in the canvas (Textbox and Image fabric derived custom classes) to follow the new canvas width and height assigned in the node app. After this in the nodejs app I create a PNG file with the scaled objects.

The problem is that the generated PNG image (with scaled objects) seems to have all the objects badly scaled and positioned and I don't understand why. 

![wrong](https://user-images.githubusercontent.com/20070559/37830450-85efd95a-2ea2-11e8-91db-e910ed8d5a6e.png)

Removing the scaling, I can see the objects are misplaced (wrong top/left)

![noscale](https://user-images.githubusercontent.com/20070559/37830486-a2b93478-2ea2-11e8-90f5-86b2178767c1.png)

In the browser version, using fabric 1.7.20 (so no nodeJS nor node-canvas, just javascript and HTML canvas), the PNG image is created with all the objects correctly scaled and positioned.

Maybe I'm assuming/doing  something wrong. Maybe node-canvas does something differently or needs something. I don't know.
