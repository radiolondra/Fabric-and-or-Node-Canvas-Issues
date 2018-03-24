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
	//var data = '{"objects":[{"type":"rect","originX":"center","originY":"center","left":300,"top":150,"width":150,"height":150,"fill":"#29477F","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgba(94, 128, 191, 0.5)","blur":5,"offsetX":10,"offsetY":10},"visible":true,"clipTo":null,"rx":0,"ry":0,"x":0,"y":0},{"type":"circle","originX":"center","originY":"center","left":300,"top":400,"width":200,"height":200,"fill":"rgb(166,111,213)","overlayFill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"#5b238A","blur":20,"offsetX":-20,"offsetY":-10},"visible":true,"clipTo":null,"radius":100}],"background":""}';
	//var data = '{"objects":[{"type":"CustomRect","originX":"left","originY":"top","left":100,"top":100,"width":200,"height":200,"fill":"#ff0000","stroke":"#000000","strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"rgba(0,0,0,0)","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"rx":0,"ry":0,"myid":0,"myname":"Rect_0000","startframe":0,"durationframes":90,"appeareffect":"none","disappeareffect":"none","effectdurationappear":0,"effectdelayappear":0,"effecteasingappear":"","effectdurationdisappear":0,"effectdelaydisappear":0,"effecteasingdisappear":""}]}';
	//var data = '{"objects":[{"type":"CustomImage","originX":"left","originY":"top","left":170,"top":51,"width":240,"height":151,"fill":"rgb(0,0,0)","stroke":"#000000","strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1.86,"scaleY":1.86,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"rgba(0,0,0,0)","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"crossOrigin":"","alignX":"none","alignY":"none","meetOrSlice":"meet","src":"data:image/png;base64,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","filters":[],"resizeFilters":[],"myid":0,"myname":"Image_0000","startframe":0,"durationframes":90,"appeareffect":"none","disappeareffect":"none","imagelink":"","effectdurationappear":0,"effectdelayappear":0,"effecteasingappear":"","effectdurationdisappear":0,"effectdelaydisappear":0,"effecteasingdisappear":""}]}';
	
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
	
	
	/*
	var readStream = fs.createReadStream(projectFile, 'utf8');
	var data = '';
	
	readStream.on('data', function(chunk) {
    data += chunk;
	});
	readStream.on('end', function() {
    	console.log(data);
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
	});
	*/
	
	console.log("prepare to load");
	var data = req.body.mydata;
	res.end();
    canvas.loadFromJSON(data, function() {
		console.log("loaded");
		canvas.renderAll();
		
		var saveJson = JSON.stringify(canvas);
		fs.writeFile("saveJSON.prj", saveJson, function(err) {
    		if(err) {
        	 console.log(err);
    		} else {
	    		console.log("The file has been saved!");
	    	}
		}); 
		
		console.log("rendered");
		/*
		var out = fs.createWriteStream(__dirname + '/mio2.png');
		var stream = canvas.createPNGStream();
		stream.on('data', function(chunk){
			//res.write(chunk);
			out.write(chunk);
		});
		stream.on('end', function() {
			//res.end();
			console.log("Finished!");
		});
		*/
		var dataUrl = canvas.toDataURL({format:'png'});
		dataUrl = dataUrl.split(',')[1]; 
		
		var buffer = new Buffer(dataUrl, 'base64');
		
		
		// writes the frame to file
		fs.writeFile(__dirname + '/mio2.png', 
			buffer.toString('binary'), 
			'binary', 
		(err) => {
	  		if (err) throw err;
			console.log('--------- mio2.png file has been saved!');
		});	
	});
	
	/*
	var data = '';
    req.on("data",function(chunk){
        data += chunk.toString();
        console.log('-- chunk arrived:' + chunk.toString());
    });
    req.on("end",function(){
    	res.end();
        canvas.loadFromJSON(data, function() {
			console.log("loaded");
			canvas.renderAll();
			
			console.log("rendered");
			var out = fs.createWriteStream(__dirname + '/mio2.png');
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
    });
	*/
	
	/*
	fs.readFile(projectFile, 'utf8', function(err, data) {
  		if (err) throw err;
  		console.log('OK: ' + projectFile);
  		
  		//console.log(data);
  		
  		// REMOVE THE BOM or loadFromJSON will fail
  		data = data.replace(/^\uFEFF/, '');
  		
		canvas.loadFromJSON(data, function() {
			console.log("loaded");
			canvas.renderAll();
            
            canvas.forEachObject(function (obj) {
            	//obj.lockUniScaling = false;
            	
        		obj.set('scaleX', Math.round(obj.get('scaleX') * scaleMultiplierX));
        		obj.set('scaleY', Math.round(obj.get('scaleY') * scaleMultiplierY));
        		
        		obj.set('left', Math.round(obj.get('left') * scaleMultiplierX));
        		obj.set('top', Math.round(obj.get('top') * scaleMultiplierY));
        		
			    obj.setCoords();
			    console.log('DIM Left:' + obj.left + ' Top:' + obj.top + ' ScaleX:' + obj.scaleX + ' ScaleY:' + obj.scaleY);
                //resizeObject(obj, scaleMultiplierX, scaleMultiplierY);
            });
            
            canvas.renderAll();
            
            
			
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
	*/
	
});

function resizeObject(object, sX, sY) {

    object.scaleX = object.scaleX * sX;
    object.scaleY = object.scaleY * sY;
    object.left = object.left * sX;
    object.top = (object.top * sY);
    object.setCoords();
}
// Export this app
module.exports = ftest;