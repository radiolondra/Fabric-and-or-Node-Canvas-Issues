require("http").globalAgent.maxSockets = Infinity;

var express = require('express');

var ftestfproject = express(),
    server = require('http').createServer(ftestfproject),
    io = require('socket.io').listen(server),
    fs = require('fs');

// initialize body-parser to parse incoming parameters requests to req.body
var bodyParser = require('body-parser');
ftestfproject.use(bodyParser.urlencoded({ extended: true }));

ftestfproject.use(express.static(__dirname + '/libs'));

// INCLUDE MY FABRIC FUNCTIONS
require('./fabfunctions.js')();

// CORS
var cors = require('cors');
ftestfproject.options('*', cors());

// FFMPEG
var spawn = require('child_process').spawn;
var path = require('path');


// Accept all connection origins
io.set('origins','*:*');

// Listening on port 
server.listen(44533);


// ------------------------------------------------------------
// HTTP ROUTES
// ------------------------------------------------------------
ftestfproject.get('/', function (req, res) {
	res.sendFile(__dirname + '/testProject.html');
});

ftestfproject.post('/process', function(req, res) {
	var fabric = getFabric();
	//fabric.Object.prototype.transparentCorners = false;
    //fabric.Object.prototype.padding = 5;
    
    // Regulate padding to background
    /*
    fabric.Text.prototype.set({
        _getNonTransformedDimensions() { // Object dimensions
        return new fabric.Point(this.width, this.height).scalarAdd(this.padding);
        },
        _calculateCurrentDimensions() { // Controls dimensions
            return fabric.util.transformPoint(this._getTransformedDimensions(), this.getViewportTransform(), true);
        }
    });
    */
    
	var canvas = createNodeCanvas();
	
	
	var oriCanvasW = 900;
	var oriCanvasH = 510;
	var wantedW = 1920;
	var wantedH = 1080;
	
	canvas.setWidth(wantedW);
	canvas.setHeight(wantedH);
	//canvas.renderOnAddRemove=false;
	
	var scaleMultiplierX = wantedW / oriCanvasW;
	var scaleMultiplierY = wantedH / oriCanvasH;
	
	var projectFile = __dirname + '/project23.viprj';
	
	//res.writeHead(200, {'Content-Type': 'image/png'});
	
	/*
	console.log("prepare to load");
	
	canvas.loadFromJSON(data, function() {
		console.log("loaded");
		canvas.renderAll();
		console.log("rendered");
		var out = fs.createWriteStream(__dirname + '/mio.png')
		var stream = canvas.createPNGStream();
		stream.on('data', function(chunk){
			//res.write(chunk);
			out.write(chunk);
		});
		stream.on('end', function() {
			//res.end();
			console.log("Finished!");
		});
	});
	*/
	
	console.log("prepare to load");
	
	// Reads the project file created in the browser
	// HTML canvas in browser
	fs.readFile(projectFile, 'utf8', function(err, data) {
  		if (err) throw err;
  		console.log('OK: ' + projectFile);
  		
  		//console.log(data);
  		
  		// REMOVE THE BOM from data or loadFromJSON will fail
  		data = data.replace(/^\uFEFF/, '');
  		
		// loads the project data in the node-canvas canvas
		canvas.loadFromJSON(data, function() {
			console.log("loaded");
			canvas.renderAll();
            
			// Scale/position all the objects for the new canvas dimensions
            canvas.forEachObject(function (obj) {
        		obj.set('scaleX', Math.round(obj.get('scaleX') * scaleMultiplierX));
        		obj.set('scaleY', Math.round(obj.get('scaleY') * scaleMultiplierY));
        		
        		obj.set('left', Math.round(obj.get('left') * scaleMultiplierX));
        		obj.set('top', Math.round(obj.get('top') * scaleMultiplierY));
        		
			    obj.setCoords();
			    console.log('DIM Left:' + obj.left + ' Top:' + obj.top + ' ScaleX:' + obj.scaleX + ' ScaleY:' + obj.scaleY);
            });
            
            canvas.renderAll();
            
			// Creates the PNG file from node-canvas canvas
			console.log("rendered");
			var out = fs.createWriteStream(__dirname + '/mio2.png');
			var stream = canvas.createPNGStream();
			stream.on('data', function(chunk){
				//res.write(chunk);
				out.write(chunk);
			});
			stream.on('end', function() {
				res.end();
				console.log("Finished!");
			});
		});
	});
	
	
});

// Export this app
module.exports = ftestfproject;
