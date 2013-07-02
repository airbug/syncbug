//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbugserver')

//@Export('SyncbugController')

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
// Class
//-------------------------------------------------------------------------------

var SyncbugController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(bugCallRouter, syncObjectService) {

        this._super();

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter  = bugCallRouter;


        /**
         * @private
         * @type {SyncObjectService}
         */
        this.syncObjectService = syncObjectService;
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
            delete: function(request, responder) {
                var data    = request.getData();
                var options = data.options;
                var syncKey = data.syncKey;
                _this.syncObjectService.deleteSyncObject(request.getCallManager(), syncKey, options, function(error){
                    var data        = null;
                    var response    = null;
                    if (!error) {
                        data        = {syncKey: syncKey};
                        response    = responder.response("deleteResponse", data);
                    } else {
                        data    = {
                            syncKey: syncKey,
                            exception: exception.toObject()
                        };
                        response    = responder.response("deleteError", data);
                    }
                    responder.sendResponse(response);
                });
            },
            get: function(request, responder){
                var data        = request.getData();
                var syncKey     = data.syncKey;
                var options     = data.options;
                _this.syncObjectService.getSyncObject(request.getCallManager(), syncKey, options, function(exception, syncObject) {
                    var data        = null;
                    var response    = null;
                    if (!exception) {
                        data        = {
                            syncObject: syncObject
                        };
                        response    = responder.response("getResponse", data);
                    } else {
                        data        = {
                            syncKey: syncKey,
                            exception: exception.toObject()
                        };
                        response    = responder.response("getException", data);
                    }
                    responder.sendResponse(response);
                });
            },
            set: function(request, responder) {
                var data        = request.getData();
                var syncKey     = data.syncKey;
                var syncObject  = data.syncObject;
                var options     = data.options;
                _this.syncObjectService.setSyncObject(request.getCallManager(), syncKey, syncObject, options, function(exception) {
                    var data        = null;
                    var response    = null;
                    if (!error) {
                        data        = {};
                        response    = responder.response("setResponse", data);
                    } else {
                        data        = {
                            syncKey: syncKey,
                            exception: exception.toObject()
                        };
                        response    = responder.response("setException", data);
                    }
                    responder.sendResponse(response);
                })
            },
            unsync: function(request, responder) {
                var data    = request.getData();
                var options = data.options;
                var syncKey = data.syncKey;
                _this.syncObjectService.unsyncSyncObject(request.getCallManager(), syncKey, options, function(error){
                    var data        = null;
                    var response    = null;
                    if (!error) {
                        data        = {syncKey: syncKey};
                        response    = responder.response("unsyncResponse", data);
                    } else {
                        data    = {
                            syncKey: syncKey,
                            error: error
                        };
                        response    = responder.response("unsyncError", data);
                    }
                    responder.sendResponse(response);
                });
            }
        })
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbugserver.SyncbugController', SyncbugController);
