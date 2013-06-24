//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbugserver')

//@Export('CallService')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {BugCallServer} bugCallServer
     */
    _constructor: function(bugCallServer) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallServer}
         */
        this.bugCallServer              = bugCallServer;

        /**
         * @private
         * @type {Map}
         */
        this.userToConnectionsMap       = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function()} callback
     */
    initialize: function(callback){
        if(!callback || typeof callback !== 'function') var callback = function(){};

        this.bugCallServer.on(BugCallServerEvent.CONNECTION_ESTABLISHED, this.handleConnectionEstablishedEvent, this, false);

        callback();
    },

    /**
     * @param {} userId
     * @return {Set.<CallConnection>}
     */
    findConnectionsByUserId: function(userId){
        return this.userToConnectionsMap.get(userId);
    },

    /**
     * @param {Event}
     */
    handleConnectionEstablishedEvent: function(event){
        var data                = event.getData();
        var callConnection      = data.callConnection;
        var userId              = callConnection.getHandshakeData().session.user.id;

        this.registerConnection(userId, connection);
    },

    /**
     * @param {} userId
     * @param {CallConnection} connection
     */
    registerConnection: function(userId, connection){
        var connections = this.userToConnectionsMap.get(userId);

        if(!connections){
            connections = new Set([connection]);
            this.userToConnectionsMap.put(userId, connections);
        } else {
            connections.add(connection);
        }
    },

    deregisterConnection: function(userId, connection){
        var connections = this.userToConnectionsMap.get(userId);

        if(connections){
            connections.remove(connection);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbugserver.CallService', CallService);

