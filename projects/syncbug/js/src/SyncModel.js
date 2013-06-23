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

	_constructor: function(data){

		this.dataModel = data;

		for (var prop in data){
			if(typeof data[prop] !== 'function'){
				this.dataModel[prop] = data[prop];
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
		return this.dataModel[prop];
	},

	/**
	 * @param {string} prop
	 */
	remove: function(prop){
		delete this.dataModel[prop];
	},

	/**
	 * @param {string} prop
	 * @param {*} value
	 */
	set: function(prop, value){
		this.dataModel[prop] = value;
	}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbug.SyncModel', SyncModel);
