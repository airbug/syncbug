//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbug')

//@Export('SyncObjectService')

//@Require('Class')
//@Require('Obj')
//@Require('synccache.SyncCacheEvent')
//@Require('syncbugserver.SyncException')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var SyncCacheEvent  = bugpack.require('synccache.SyncCacheEvent');
var SyncException   = bugpack.require('syncbugserver.SyncException');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SyncObjectService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {CallService} callService
     * @param {SyncCache} syncCache
     * @param {SyncObjectManager} syncObjectManager
     */
    _constructor: function(callService, syncCache, syncObjectManager) {

        this._super();

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallService}
         */
        this.callService  = callService;

        /**
         * @private
         * @type {SyncCache}
         */
        this.syncCache          = syncCache;

        /**
         * @private
         * @type {SyncObjectManager}
         */
        this.syncObjectManager  = syncObjectManager;
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    initialize: function(callback) {
        this.syncCache.addEventListener(SyncCacheEvent.DELETE, this.hearSyncCacheDelete, this);
        this.syncCache.addEventListener(SyncCacheEvent.UPDATE, this.hearSyncCacheUpdate, this);
    },

    getSyncObject: function(key, options, callback) {
        var _this = this;
        this.syncCache.get(key, options, function(exception, cache) {
            if (!exception) {
                callback(null, cache);
            } else {
                if (exception.getType() === "nocache") {
                    _this.syncObjectManager.findSyncObjectByKey(key, function(error, syncObject) {
                        if (!error) {
                            if (syncObject) {

                                //NOTE BRN: We don't wait for the sync cache to complete updating here since this
                                // can take a while.
                                _this.syncCache.set(syncObject.key, syncObject.data, function(error) {
                                    if (error) {}
                                    //TODO BRN: What do we do if this fails? x
                                });
                                callback(null, syncObject.object);
                            } else {
                                callback(new SyncException(SyncException.NO_SUCH_OBJECT));
                            }
                        } else {
                            callback(error);
                        }
                    });
                } else {
                    callback(exception);
                }
            }
        })
    },

    putSyncObject: function(key, options, callback) {

    },

    removeSyncObject: function(key, options, callback) {

    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {SyncCacheEvent} syncCacheEvent
     */
    hearSyncCacheDelete: function(syncCacheEvent) {
        //Get all connections associated with the key and send them a "delete" request
    },

    /**
     * @private
     * @param {SyncCacheEvent} syncCacheEvent
     */
    hearSyncCacheUpdate: function(syncCacheEvent) {
        var key     = syncCacheEvent.getKey();
        var data    = syncCacheEvent.getData();
        var previousSyncObject = data.previous;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbug.SyncObjectService', SyncObjectService);
