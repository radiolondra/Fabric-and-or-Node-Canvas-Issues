require("http").globalAgent.maxSockets = Infinity;

var express = require('express');

var ftestfjson = express(),
    server = require('http').createServer(ftestfjson),
    io = require('socket.io').listen(server),
    fs = require('fs');

// initialize body-parser to parse incoming parameters requests to req.body
var bodyParser = require('body-parser');
ftestfjson.use(bodyParser.urlencoded({ extended: true }));

ftestfjson.use(express.static(__dirname + '/libs'));

// INCLUDE MY FABRIC FUNCTIONS
require('./fabfunctions.js')();

// CORS
var cors = require('cors');
ftestfjson.options('*', cors());

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
ftestfjson.get('/', function (req, res) {
	res.sendFile(__dirname + '/testJson.html');
});

ftestfjson.post('/process', function(req, res) {
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
	
	// Node-canvas canvas dimensions
	var wantedW = 1920;
	var wantedH = 1080;
	
	canvas.setWidth(wantedW);
	canvas.setHeight(wantedH);
		
	console.log("prepare to load");
	
	// data contains json objects already scaled/repositioned in HTML canvas
	// here we just want to create the PNG from the json as it is
	// from the node-canvas canvas
	var data = req.body.mydata;
	res.end();
    canvas.loadFromJSON(data, function() {
		console.log("loaded");
		canvas.renderAll();
		
		// here we save the node-canvas canvas content into a new file
		// so after we can check if data VS new file content are the same
		var saveJson = JSON.stringify(canvas);
		fs.writeFile("saveJSON.viprj", saveJson, function(err) {
    		if(err) {
        	 console.log(err);
    		} else {
	    		console.log("The file has been saved!");
	    	}
		}); 
		
		console.log("rendered");
		
		// Creates the PNG from canvas (createPNGStream)
		var out = fs.createWriteStream(__dirname + '/mio2.png');
		var stream = canvas.createPNGStream();
		stream.on('data', function(chunk){
			//res.write(chunk);
			out.write(chunk);
		});
		stream.on('end', function() {
			//res.end();
			console.log('>> mio2.png file has been saved!');
		});
		
		/*
		// another way to create the PNG (toDataURL)
		var dataUrl = canvas.toDataURL({format:'png'});
		dataUrl = dataUrl.split(',')[1]; 
		
		var buffer = new Buffer(dataUrl, 'base64');

		// writes the frame to file
		fs.writeFile(__dirname + '/mio2.png', 
			buffer.toString('binary'), 
			'binary', 
		(err) => {
	  		if (err) throw err;
			console.log('>> mio2.png file has been saved!');
		});
		*/
		// -----------------------------------------------------------------------
		// BOTH WAYS TO CREATE PNG FROM CANVAS GENERATE PNG WITH MISPLACED OBJECTS
		// -----------------------------------------------------------------------
	});	
});

// Export this app
module.exports = ftestfjson;
