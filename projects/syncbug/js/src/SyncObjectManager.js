//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbug')

//@Export('SyncObjectManager')

//@Require('Class')
//@Require('Map')
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
var Map         = bugpack.require('Map');
var Obj         = bugpack.require('Obj');
var SyncObject  = bugpack.require('syncbug.SyncObject');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SyncObjectManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(){

        this._super();

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map}
         */
        this.syncObjectMap = new Map();
    },

    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} syncKey
     * @param {{*}} object
     * @param {function(error, syncObject)} callback
     */
    createSyncObject: function(syncKey, object, callback){
        if (!this.syncObjectMap.containsKey(syncKey)) {
            var syncObject = new SyncObject(object);
            this.syncObjectMap.put(syncKey, syncObject);
            callback(null, syncObject);
        } else {
            callback(new Error("SyncObject of key '", syncKey, "' is already registered"));
        }
    },

    /**
     * @param {string} syncKey
     * @param {function(error)} callback
     */
    deleteSyncObjectBySyncKey: function(syncKey, callback){
        var syncObject = this.syncObjectMap.get(syncKey);
        if (syncObject) {
            this.syncObjectMap.remove(syncKey);

        } else {
            callback(new Error("SyncObject of key '", syncKey, "' is already deleted"));
        }
    },

    /**
     * @param {string} syncKey
     * @param {function(error, SyncObject)} callback
     */
    getSyncObjectBySyncKey: function(syncKey, callback){
        var syncObject = this.syncObjectMap.get(syncKey);
        callback(null, syncObject);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbug.SyncObjectManager', SyncObjectManager);
