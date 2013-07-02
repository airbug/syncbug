//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbug')

//@Export('SyncObjectController')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class   = bugpack.require('Class');
var Obj     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SyncObjectController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(bugCallRouter, syncObjectService){

        this._super();

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter      = bugCallRouter;

        /**
         * @private
         * @type {SyncObjectService}
         */
        this.syncObjectService   = syncObjectService;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function(callback){
        var _this = this;
        this.bugCallRouter.addAll({
            delete: function(request, responder){
                var data    = request.getData();
                var syncKey = data.syncKey;
                _this.syncObjectService.deleteSyncObject(syncKey, function(error){
                    if(!error){
                        var data        = {syncKey: syncKey};
                        var response    = responder.response("deleteResponse", data);
                    } else {
                        var data        = {
                            syncKey: syncKey,
                            error: error
                        };
                        var response    = responder.response("deleteError", data);
                    }
                    responder.sendResponse(response);
                });
            },
            set: function(request, responder){
                var data        = request.getData();
                var syncKey     = data.syncKey;
                var syncObject 	= data.syncObject;
                _this.syncObjectService.setSyncObject(syncKey, syncObject, function(error, SyncObject) {
                    if(!error){
                        var data        = {syncKey: syncKey};
                        var response    = responder.response("setResponse", data);
                    } else {
                        var data        = {
                            syncKey: syncKey,
                            error: error
                        };
                        var response    = responder.response("setError", data);
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

bugpack.export('syncbug.SyncObjectController', SyncObjectController);
