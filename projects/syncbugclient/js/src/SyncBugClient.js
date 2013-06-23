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

	_constructor: function(bugCallClient){

		/**
		 * @type {BugCallClient}
		 */
		this.bugCallClient = bugCallClient;
	},


	//-------------------------------------------------------------------------------
	// Instance Methods
	//-------------------------------------------------------------------------------

	/**
	 * @param {string} key
	 * @param {
	 * 		accessKey: string
	 * } options
	 * @param {function(exception, syncModel)} callback
	 */
	get: function(key, options, callback){
		var requestType = SyncBugClient.requestType.GET;
		var data 		= {};
		this.bugCallClient.request(requestType, data, function(exception, callResponse){
			if(!exception){
				var responseType 	= callResponse.getType();
				var syncModelObj 	= callResponse.getData();
				var syncModel 		= new SyncModel(syncModelObj);
				callback(null, syncModel);
			} else {
				callback(exception, null);
			}
		});
	},

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
	 * @param {function(exception, syncModel)} callback
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
	GET: "get",
	PUT: "put",
	REMOVE: "remove"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbugclient.SyncBugClient', SyncBugClient);
