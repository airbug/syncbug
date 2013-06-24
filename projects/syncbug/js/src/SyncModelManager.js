//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbug')

//@Export('SyncModelManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class 	= bugpack.require('Class');
var Map 	= bugpack.require('Map');
var Obj 	= bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SyncModelManager = Class.extend(Obj, {

	_constructor: function(){

		/**
	 	 * @type {Map}
	 	 */
		this.syncModelMap = new Map();
	},

	//-------------------------------------------------------------------------------
	// Instance Methods
	//-------------------------------------------------------------------------------

	/**
	 * @param {string} key
	 * @param {{*}} syncModelObj
	 * @param {function(error, syncModel)} callback
	 */
	createSyncModel: function(syncModelObj, callback){
		var key = syncModelObj.key;
		if(!this.syncModelMap.get(key)){
			var syncModel = new SyncModel(syncModelObj);
			this.syncModelMap.put(key, syncModel);
			callback(null, syncModel);
		} else {
			callback(new Error("syncModel of key,", key, "is already registered"));
		}
	},

	/**
	 * @param {string} key
	 * @param {function(error)} callback
	 */
	deleteSyncModelByKey: function(key, callback){
		if(this.syncModelMap.get(key)){
			var error = null;
			try {
				this.syncModelMap.remove(key);
			} catch(error) {
				error = error;
			} finally{
				callback(error);
			}
		} else {
			callback(new Error("syncModel of key,", key, "is not registered"));
		}
	},

	/**
	 * @param {string} key
	 * @param {function(error, syncModel)} callback
	 */
	findSyncModelByKey: function(key, callback){
		var syncModel = this.syncModelMap.get(key);
		callback(null, syncModel);
	},

	/**
	 * @param {string} key
	 * @param {SyncModel} syncModel
	 */
	updateSyncModelByKey: function(key, syncModel, callback){
		if(this.syncModelMap.get(key)){
			this.syncModelMap.put(key, syncModel);
			callback(null);
		} else {
			callback(new Error("syncModel of key,", key, "is not registered"));
		}
	}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbug.SyncModelManager', SyncModelManager);
