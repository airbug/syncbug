//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbugserver')

//@Export('SyncObjectManager')

//@Require('Class')
//@Require('mongo.MongoManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MongoManager    = bugpack.require('mongo.MongoManager');


//-------------------------------------------------------------------------------
// Class
//-------------------------------------------------------------------------------

var SyncObjectManager = Class.extend(MongoManager, {

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} syncKey
     * @param {function(Error, SyncObject)} callback
     */
    findSyncObjectBySyncKey: function(syncKey, callback) {
        this.findOne({syncKey: syncKey}, callback);
    },

    /**
     * @param {string} syncKey
     * @param {function(Error)}
     */
    removeSyncObjectBySyncKey: function(syncKey, callback) {
        this.remove({syncKey: syncKey}, callback);
    },

    /**
     * @param {string} syncKey
     * @param {Object} object
     * @param {function(Error, Session)=} callback
     */
    updateOrCreateSyncObject: function(syncKey, object, callback) {
        var syncObject = {
            syncKey: syncKey,
            object: object
        };
        this.findOneAndUpdate({syncKey:syncKey}, syncObject, {upsert: true, new: true}, function(error, syncObject) {
            if (callback) {
                callback(error, syncObject);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbugserver.SyncObjectManager', SyncObjectManager);
