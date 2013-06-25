//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbug')

//@Export('SyncModel')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class 	= bugpack.require('Class'); 
var Obj 	= bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SyncModel = Class.extend(Obj, {

	_constructor: function(dataObj){

		this.dataObj = dataObj;

		for (var prop in dataObj){
			if(typeof dataObj[prop] !== 'function'){
				this.dataObj[prop] = dataObj[prop];
			}
		}
	},

	//-------------------------------------------------------------------------------
	// Instance Methods
	//-------------------------------------------------------------------------------

	/**
	 * @param {string} prop
	 * @return {*}
	 */
	get: function(prop){
		return this.dataObj[prop];
	},

	/**
	 * @param {string} prop
	 */
	remove: function(prop){
		delete this.dataObj[prop];
	},

	/**
	 * @param {string} prop
	 * @param {*} value
	 */
	set: function(prop, value){
		this.dataObj[prop] = value;
	}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbug.SyncModel', SyncModel);
