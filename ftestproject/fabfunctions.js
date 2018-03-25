module.exports = function() { 
	//var fabric = require('/usr/local/lib/node_modules/fabric').fabric;
	var fabric = require('fabric').fabric;
	
	// ===============================================================================
    // create my custom fabric classes
    // ===============================================================================
    
    // ------------------------------------------------------ CustomText
    fabric.CustomText = fabric.util.createClass(fabric.Textbox, {

        type: 'CustomText', // if classname = 'CustomText' then the type MUST be 'CustomText'

        initialize: function (element, options) {
            options || ( options = { });
            this.callSuper('initialize', element, options);
            options && this.set('myid', options.myid);
            options && this.set('myname', options.myname);
            options && this.set('startframe', options.startframe);
            options && this.set('durationframes', options.durationframes);
            options && this.set('appeareffect', options.appeareffect);
            options && this.set('disappeareffect', options.disappeareffect);
            options && this.set('effectdurationappear', options.effectdurationappear);
            options && this.set('effectdelayappear', options.effectdelayappear);
            options && this.set('effecteasingappear', options.effecteasingappear);
            options && this.set('effectdurationdisappear', options.effectdurationdisappear);
            options && this.set('effectdelaydisappear', options.effectdelaydisappear);
            options && this.set('effecteasingdisappear', options.effecteasingdisappear);
        },

        _render: function (ctx) {
            this.callSuper('_render', ctx);
        },
        
        toObject: function () {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                myid: this.get("myid"),
                myname: this.get("myname"),
                startframe: this.get("startframe"),
                durationframes: this.get("durationframes"),
                appeareffect: this.get("appeareffect"),
                disappeareffect: this.get("disappeareffect"),
                effectdurationappear: this.get("effectdurationappear"),
                effectdelayappear: this.get("effectdelayappear"),
                effecteasingappear: this.get("effecteasingappear"),
                effectdurationdisappear: this.get("effectdurationdisappear"),
                effectdelaydisappear: this.get("effectdelaydisappear"),
                effecteasingdisappear: this.get("effecteasingdisappear")
            });
        },

    });


    // SYNCHRONOUS
    fabric.CustomText.fromObject = function (object, callback) {
        return fabric.Object._fromObject('CustomText', object, callback, 'text');
    };
    
    fabric.CustomText.async = false;
    
    // -------------------------------------------------------------------------------
    
    // ------------------------------------------------------ CustomImage
    
    fabric.CustomImage = fabric.util.createClass(fabric.Image, {

        type: 'CustomImage', // if classname = 'CustomImage' then the type MUST be 'CustomImage'

        initialize: function (element, options) {
            options || ( options = { });
            this.callSuper('initialize', element, options);
            options && this.set('myid', options.myid);
            options && this.set('myname', options.myname);
            options && this.set('startframe', options.startframe);
            options && this.set('durationframes', options.durationframes);
            options && this.set('appeareffect', options.appeareffect);
            options && this.set('disappeareffect', options.disappeareffect);
            options && this.set('imagelink', options.imagelink);
            options && this.set('effectdurationappear', options.effectdurationappear);
            options && this.set('effectdelayappear', options.effectdelayappear);
            options && this.set('effecteasingappear', options.effecteasingappear);
            options && this.set('effectdurationdisappear', options.effectdurationdisappear);
            options && this.set('effectdelaydisappear', options.effectdelaydisappear);
            options && this.set('effecteasingdisappear', options.effecteasingdisappear);
        },
        
        _render: function (ctx) {
            this.callSuper('_render', ctx);
        },

        toObject: function () {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                myid: this.get("myid"),
                myname: this.get("myname"),
                startframe: this.get("startframe"),
                durationframes: this.get("durationframes"),
                appeareffect: this.get("appeareffect"),
                disappeareffect: this.get("disappeareffect"),
                imagelink: this.get("imagelink"),
                effectdurationappear: this.get("effectdurationappear"),
                effectdelayappear: this.get("effectdelayappear"),
                effecteasingappear: this.get("effecteasingappear"),
                effectdurationdisappear: this.get("effectdurationdisappear"),
                effectdelaydisappear: this.get("effectdelaydisappear"),
                effecteasingdisappear: this.get("effecteasingdisappear")
            });
        },

    });


    fabric.CustomImage.fromObject = function(object, callback) {
        fabric.util.loadImage(object.src, function(img) {
            callback && callback(new fabric.CustomImage(img, object));
        });
    };
    
    fabric.CustomImage.async = true;
    
    fabric.CustomImage.fromURL = function (url, callback, options) {
        fabric.util.loadImage(url, function (img) {
            callback(new fabric.CustomImage(img, options));
        }, null, options && options.crossOrigin);
    };
    
    // -------------------------------------------------------------------------------
	
	// ------------------------------------------------------ CustomRect
    
    fabric.CustomRect = fabric.util.createClass(fabric.Rect, {

        type: 'CustomRect',

        initialize: function (element, options) {
            this.callSuper('initialize', element, options);
            options && this.set('myid', options.myid);
            options && this.set('myname', options.myname);
            options && this.set('startframe', options.startframe);
            options && this.set('durationframes', options.durationframes);
            options && this.set('appeareffect', options.appeareffect);
            options && this.set('disappeareffect', options.disappeareffect);
            options && this.set('effectdurationappear', options.effectdurationappear);
            options && this.set('effectdelayappear', options.effectdelayappear);
            options && this.set('effecteasingappear', options.effecteasingappear);
            options && this.set('effectdurationdisappear', options.effectdurationdisappear);
            options && this.set('effectdelaydisappear', options.effectdelaydisappear);
            options && this.set('effecteasingdisappear', options.effecteasingdisappear);
        },

        toObject: function () {
            return fabric.util.object.extend(this.callSuper('toObject'), {
                myid: this.get("myid"),
                myname: this.get("myname"),
                startframe: this.get("startframe"),
                durationframes: this.get("durationframes"),
                appeareffect: this.get("appeareffect"),
                disappeareffect: this.get("disappeareffect"),
                effectdurationappear: this.get("effectdurationappear"),
                effectdelayappear: this.get("effectdelayappear"),
                effecteasingappear: this.get("effecteasingappear"),
                effectdurationdisappear: this.get("effectdurationdisappear"),
                effectdelaydisappear: this.get("effectdelaydisappear"),
                effecteasingdisappear: this.get("effecteasingdisappear")
            });
        },
        
        _render: function (ctx) {
            this.callSuper('_render', ctx);
        },

    });

    // SYNCHRONOUS
    fabric.CustomRect.fromObject = function (object, callback, forceAsync) {
        return fabric.Object._fromObject('CustomRect', object, callback, forceAsync, null);
    };
    fabric.CustomRect.async = false;
    
    // --------------------------------------------------------------------------------    
	// MODULE EXPORTED FUNCTIONS
	// --------------------------------------------------------------------------------
	this.getFabric = function() { return fabric; };
	
	this.createNodeCanvas = function() { 
		var canvas = new fabric.StaticCanvas();
		canvas.custom_attribute_array = ["myid", "myname", "startframe", "durationframes", "appeareffect", "disappeareffect", "imagelink", "effectdurationappear", "effectdelayappear", "effecteasingappear", "effectdurationdisappear", "effectdelaydisappear", "effecteasingdisappear"];
		return canvas;
	};
//this.multiply = function(a,b) { return a*b };
    //etc
}