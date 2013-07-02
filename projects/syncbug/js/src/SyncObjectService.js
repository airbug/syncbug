//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbug')

//@Export('SyncObjectService')

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

var SyncObjectService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(syncObjectManager){

        this._super();

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SyncObjectManager}
         */
        this.syncObjectManager   = syncObjectManager;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} syncKey
     * @param {function(error)} callback
     */
    deleteSyncObject: function(syncKey, callback){
        this.syncObjectManager.deleteSyncObjectBySyncKey(syncKey, callback);
    },

    /**
     * @param {string} syncKey
     * @param {Object} syncObject
     * @param {function(error, SyncObject)} callback
     */
    setSyncObject: function(syncKey, syncObject, callback){
        this.syncObjectManager.getSyncObjectBySyncKey(syncKey, function(error, syncObject) {
            if (!error) {
                syncObject.setSyncObject(syncObject);
            } else {
                callback(error);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbug.SyncObjectService', SyncObjectService);
