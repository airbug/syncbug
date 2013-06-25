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
            get: function(request, responder){
                var data    = request.getData();
                var key     = data.key;
                var options = data.options;
                _this.syncObjectService.getSyncObject(request.getCallManager(), key, options, function(error, syncObject) {
                    var data        = null;
                    var response    = null;
                    if (!error) {
                        data        = {syncObject: syncObject};
                        response    = responder.response("getResponse", data);
                    } else {
                        data        = {
                            key: key,
                            error: error
                        };
                        response    = responder.response("getError", data);
                    }
                    responder.sendResponse(response);
                });
            },
            put: function(request, responder) {
                var data        = request.getData();
                var key         = data.key;
                var options     = data.options;
                var syncObject  = data.syncObject;
                _this.syncObjectService.putSyncObject(request.getCallManager(), key, options, syncObject, function(error) {
                    var data        = null;
                    var response    = null;
                    if (!error) {
                        data        = {};
                        response    = responder.response("putResponse", data);
                    } else {
                        data        = {
                            key: key,
                            error: error
                        };
                        response    = responder.response("putError", data);
                    }
                    responder.sendResponse(response);
                })
            },
            remove: function(request, responder){
                var data    = request.getData();
                var options     = data.options;
                var key     = data.key;
                _this.syncObjectService.removeSyncModel(request.getCallManager(), key, options, function(error){
                    var data        = null;
                    var response    = null;
                    if (!error) {
                        data        = {key: key};
                        response    = responder.response("removeResponse", data);
                    } else {
                        data    = {
                            key: key,
                            error: error
                        };
                        response    = responder.response("removeError", data);
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
