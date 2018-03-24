require("http").globalAgent.maxSockets = Infinity;

var express = require('express');

var ftest = express(),
    server = require('http').createServer(ftest),
    io = require('socket.io').listen(server),
    fs = require('fs');

// initialize body-parser to parse incoming parameters requests to req.body
var bodyParser = require('body-parser');
ftest.use(bodyParser.urlencoded({ extended: true }));

ftest.use(express.static(__dirname + '/libs'));

// INCLUDE MY FABRIC FUNCTIONS
require('./fabfunctions.js')();

// CORS
var cors = require('cors');
ftest.options('*', cors());

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
ftest.get('/', function (req, res) {
	res.sendFile(__dirname + '/testindex.html');
});

ftest.post('/process', function(req, res) {
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
    
	// Creates the node-canvas canvas
	var canvas = createNodeCanvas();
	
	// the HTML canvas dimensions where the objects in the project were created
	var oriCanvasW = 900;
	var oriCanvasH = 510;
	// the NODEJS canvas (node-canvas) wanted new dimensions
	var wantedW = 1920;
	var wantedH = 1080;
	
	canvas.setWidth(wantedW);
	canvas.setHeight(wantedH);
	
	// scaling factors
	var scaleMultiplierX = wantedW / oriCanvasW;
	var scaleMultiplierY = wantedH / oriCanvasH;
	
	// the project json file with the objects (HTML canvas)
	var projectFile = __dirname + '/project23.viprj';
		
	//res.writeHead(200, {'Content-Type': 'image/png'});
	
	console.log("prepare to load");
	
	// Read the project file
	fs.readFile(projectFile, 'utf8', function(err, data) {
  		if (err) throw err;
  		console.log('OK: ' + projectFile);
  		
  		//console.log(data);
  		
  		// REMOVE THE BOM from data loaded or loadFromJSON will fail
  		data = data.replace(/^\uFEFF/, '');
  		
		// loads the objects in the node-canvas
		canvas.loadFromJSON(data, function() {
			console.log("loaded");
			canvas.renderAll();
            
			// scaling and positioning object in the node-canvas
            		canvas.forEachObject(function (obj) {            	
            	
        			obj.set('scaleX', obj.get('scaleX') * scaleMultiplierX);
        			obj.set('scaleY', obj.get('scaleY') * scaleMultiplierY);
        		
        			obj.set('left', obj.get('left') * scaleMultiplierX);
        			obj.set('top', obj.get('top') * scaleMultiplierY);
        		
				obj.setCoords();
				console.log('DIM Left:' + obj.left + ' Top:' + obj.top + ' ScaleX:' + obj.scaleX + ' ScaleY:' + obj.scaleY);
            		});
            
            		canvas.renderAll();
			
       			console.log("rendered");
			
			// Creates a PNG file from node-canvas
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
module.exports = ftest;
