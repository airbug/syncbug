//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbugclient')

//@Export('SyncBugClient')

//@Require('Class')
//@Require('Obj')
//@Require('syncbug.SyncModel')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class 		= bugpack.require('Class'); 
var Obj 		= bugpack.require('Obj');
var SyncModel 	= bugpack.require('SyncModel');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SyncBugClient = Class.extend(Obj, {

	_constructor: function(bugCallClient, syncModelManager){

		/**
		 * @type {BugCallClient}
		 */
		this.bugCallClient 		= bugCallClient;

		/**
		 * @type {SyncModelManager}
		 */
		this.syncModelManager 	= syncModelManager;
	},


	//-------------------------------------------------------------------------------
	// Instance Methods (Browser)
	//-------------------------------------------------------------------------------

	/**
	 * @param {string} key
	 * @param {
	 * 		accessKey: string
	 * 		refresh: boolean
	 * } options
	 * @param {function(exception, syncModel)} callback
	 */
	get: function(key, options, callback){
		var _this = this;
		var requestType = SyncBugClient.requestType.GET;
		var data 		= {
			options: options
		};

		this.syncModelManager.findSyncModelByKey(key, function(error, syncModel){
			if(!error && syncModel && !options.refresh){
				callback(null, syncModel);
			} else {
				_this.bugCallClient.request(requestType, data, function(exception, callResponse){
					if(!exception){
						var responseType 	= callResponse.getType();
						var syncModelObj 	= callResponse.getData();
						_this.syncModelManager.createSyncModel(syncModelObj, function(error, syncModel){
							callback(error, syncModel);
						});
					} else {
						callback(exception, null);
					}
				});
			}
		});
	},

	//-------------------------------------------------------------------------------
	// Instance Methods (Server)
	//-------------------------------------------------------------------------------

	/**
	 * @param {string} key
	 * @param {*} syncModelObj
	 * @param {*} options
	 * @param {function(exception, {*})} callback
	 */
	put: function(key, syncModelObj, options, callback){
		var requestType = SyncBugClient.requestType.PUT;
		var data 		= {
			syncModelObj: syncModelObj,
			options: options
		};
		this.bugCallClient.request(requestType, data, function(exception, callResponse){
			var data = callResponse.getData();
			callback(exception, data);
		});
	},

	/**
	 * @param {string} key
	 * @param {*} options
	 * @param {function(exception)} callback
	 */
	remove: function(key, options, callback){
		var requestType = SyncBugClient.requestType.REMOVE;
		var data 		= {
			key: key,
			options: options
		};
		this.bugCallClient.request(requestType, data, function(exception, callResponse){
			callback(exception);
		});
	}
});

/**
 * @enum {string}
 */
SyncBugClient.requestType = {
	GET: "syncbugclient.get",
	PUT: "syncbugclient.put",
	REMOVE: "syncbugclient.remove"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbugclient.SyncBugClient', SyncBugClient);
