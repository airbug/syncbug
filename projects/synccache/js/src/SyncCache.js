//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('synccache')

//@Export('SyncCache')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var EventDispatcher = bugpack.require('EventDispatcher');
var Map             = bugpack.require('Map');
var Set             = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SyncCache = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, *>}
         */
        this.valueMap = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} key
     * @param {function(Error, *)} callback
     */
    get: function(key, callback) {

    },

    delete: function(key, callback) {

    },

    /**
     * @param {string} key
     * @param {*} value
     * @param {function(Error, *)} callback
     */
    set: function(key, value, callback) {
        this.valueMap.put(key, value);
    },

    sync: function(key, callback)
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('synccache.SyncCache', SyncCache);

