//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbugserver')

//@Export('CallService')

//@Require('Class')
//@Require('DualMultiSetMap')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var DualMultiSetMap     = bugpack.require('DualMultiSetMap');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * 
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DualMultiSetMap.<string, CallManager>}
         */
        this.syncKeyToCallManagerMap    = new DualMultiSetMap();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} syncKey
     * @param {CallManager} callManager
     */
    deregisterCallManagerForSyncKey: function(syncKey, callManager) {
        this.syncKeyToCallManagerMap.removeKeyValuePair(syncKey, callManager);
    },

    /**
     * @param {string} syncKey
     * @return {Set.<CallManager>}
     */
    getCallManagerSetBySyncKey: function(syncKey) {
        return this.syncKeyToCallManagerMap.getValue(syncKey);
    },

    /**
     * @param {CallManager} callManager
     * @return {Set.<string>}
     */
    getSyncKeySetByCallManager: function(callManager) {
        return this.syncKeyToCallManagerMap.getKey(callManager);
    },

    /**
     * @param {string} syncKey
     * @return {Boolean}
     */
    hasSyncKey: function(syncKey) {
        return this.syncKeyToCallManagerMap.containsKey(syncKey);
    },

    /**
     * @param {string} syncKey
     * @param {CallManager} callManager
     */
    registerCallManagerForSyncKey: function(syncKey, callManager) {
        this.syncKeyToCallManagerMap.put(syncKey, callManager);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbugserver.CallService', CallService);
