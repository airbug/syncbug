//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbugclient')

//@Export('SyncBugClient')

//@Require('Class')
//@Require('Obj')
//@Require('syncbug.SyncObject')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var SyncObject   = bugpack.require('syncbug.SyncObject');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

var SyncBugClient = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(bugCallClient, syncObjectManager){

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallClient}
         */
        this.bugCallClient      = bugCallClient;

        /**
         * @private
         * @type {SyncObjectManager}
         */
        this.syncObjectManager  = syncObjectManager;
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} syncKey
     * @param {{
     *      accessKey: string
     *      refresh: boolean
     * }} options
     * @param {function(exception, SyncObject)} callback
     */
    get: function(syncKey, options, callback){
        var _this = this;
        var requestType = SyncBugClient.requestType.GET;
        var data        = {
            options: options
        };

        this.syncObjectManager.findSyncObjectBySyncKey(syncKey, function(error, SyncObject) {
            if (!error && SyncObject && !options.refresh) {
                callback(null, SyncObject);
            } else {
                _this.bugCallClient.request(requestType, data, function(exception, callResponse) {
                    if (!exception) {
                        var responseType = callResponse.getType();
                        if (responseType === "getResponse") {
                            var syncObject = callResponse.getData().syncObject;
                            _this.syncObjectManager.createSyncObject(syncKey, syncObject, function(error, syncObject){
                                callback(error, syncObject);
                            });
                        } else {
                            callback(new Error("Unknown responseType '" + responseType + "'"));
                        }
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
     * @param {*} options
     * @param {function(exception)} callback
     */
    delete: function(key, options, callback){
        var requestType = SyncBugClient.requestType.DELETE;
        var data        = {
            syncKey: syncKey,
            options: options
        };
        this.bugCallClient.request(requestType, data, function(exception, callResponse) {
            callback(exception);
        });
    },

    /**
     * @param {string} syncKey
     * @param {*} syncObject
     * @param {*} options
     * @param {function(exception, {*})} callback
     */
    set: function(syncKey, syncObject, options, callback){
        var requestType = SyncBugClient.requestType.PUT;
        var data        = {
            syncKey: syncKey,
            syncObject: syncObject,
            options: options
        };
        this.bugCallClient.request(requestType, data, function(exception, callResponse) {
            var data = callResponse.getData();
            callback(exception, data);
        });
    },

    /**
     * @param {string} key
     * @param {*} options
     * @param {function(exception)} callback
     */
    unsync: function(key, options, callback) {
        var requestType = SyncBugClient.requestType.UNSYNC;
        var data        = {
            syncKey: syncKey,
            options: options
        };
        this.bugCallClient.request(requestType, data, function(exception, callResponse) {
            callback(exception);
        });
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
SyncBugClient.requestType = {
    DELETE: "delete",
    GET: "get",
    SET: "set",
    UNSYNC: "unsync"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbugclient.SyncBugClient', SyncBugClient);
