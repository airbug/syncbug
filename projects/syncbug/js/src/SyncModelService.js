//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbug')

//@Export('SyncModelService')

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

var SyncModelService = Class.extend(Obj, {

	_constructor: function(syncModelManager){

		/**
		 * @type {SyncModelManager}
		 */
		this.syncModelManager 	= syncModelManager;
	},

	//-------------------------------------------------------------------------------
	// Instance Methods
	//-------------------------------------------------------------------------------

	/**
	 * @param {} key
	 * @param {Array.<{
	 *		type: string,
	 *		prop: string,
	 *		value: *
	 * 		}>
	 * } changeSet
	 * @param {function(error, syncModel)} callback
	 */
	updateSyncModel: function(key, changeSet, callback){
		var _this = this;
		this.syncModelManager.findByKey(key, function(error, syncModel){
			if(!error){
				changeSet.forEach(function(changeObj){
					var changeType = changeObj.type;
					if(changeType === "update"){
						syncModel.set(changeObj.prop, changeObj.value);
					} else if(changeType === "remove"){
						syncModel.remove(changeObj.prop);
					}
				});
				callback(null, syncModel);
			} else {
				callback(error, syncModel);
			}
		});
	},

	/**
	 * @param {} key
	 * @param {function(error)} callback
	 */
	deleteSyncModel: function(key, callback){
		this.syncModelManager.deregisterSyncModel(key, callback);
	}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbug.SyncModelService', SyncModelService);
