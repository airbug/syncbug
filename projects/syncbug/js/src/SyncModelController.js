//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbug')

//@Export('SyncModelController')

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

var SyncModelController = Class.extend(Obj, {

	_constructor: function(bugCallRouter, syncModelService){

		/**
		 *
		 */
		this.bugCallRouter 		= bugCallRouter;
		/**
		 *
		 */
		this.syncModelService 	= syncModelService;
	},

	//-------------------------------------------------------------------------------
	// Instance Methods
	//-------------------------------------------------------------------------------

	/**
	 *
	 */
	configure: function(callback){
		var _this = this;
		this.bugCallRouter.addAll({
			update: function(request, responder){
				var data 		= request.getData();
				var key 		= data.key;
				/* @type {Array.<{}>] */
				var changeSet 	= data.changeSet;
				_this.syncModelService.updateSyncModel(key, changeSet, function(error, syncModel){
					if(!error){
                        var data 		= {key: key};
                        var response 	= responder.response("updatedSyncModel", data);
                    } else {
                        var data 		= {
                        	key: key,
                        	error: error
                        };
                        var response 	= responder.response("updateSyncModelError", data);
                    }
                    responder.sendResponse(response);
				});
			},
			delete: function(request, responder){
				var data 	= request.getData();
				var key 	= data.key;
				_this.syncModelService.deleteSyncModel(key, function(error){
					if(!error){
						var data 		= {key: key};
						var response 	= responder.response("deletedSyncModel", data); 
					} else {
						var data 		= {
							key: key,
							error: error
						};
						var response 	= responder.response("deleteSyncModelError", data);
					}
					responder.sendResponse(response);
				});
			}
		});

		callback();
	}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbug.SyncModelController', SyncModelController);
