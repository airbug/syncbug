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
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(model, schema) {

        this._super(model, schema);

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------


    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Object} syncObject
     * @param {function(Error, Session)=} callback
     */
    createSyncObject: function(syncObject, callback) {
        this.create(syncObject, function(error, syncObject) {
            if (callback) {
                callback(error, syncObject);
            }
        });
    },

    /**
     * @param {string} key
     * @param {function(Error, SyncObject)} callback
     */
    findSyncObjectByKey: function(key, callback) {
        this.findOne({key: key}, callback);
    },

    /**
     * @param {string} key
     * @param {function(Error)}
     */
    removeSyncObjectByKey: function(key, callback) {
        this.remove({key: key}, callback);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbugserver.SyncObjectManager', SyncObjectManager);
