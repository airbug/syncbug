//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('airbugserver')

//@Export('SyncbugServerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.BugCallServer')
//@Require('bugcall.CallServer')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugroute:bugcall.BugCallRouter')
//@Require('express.ExpressApp')
//@Require('express.ExpressServer')
//@Require('handshaker.Handshaker')
//@Require('socketio:server.SocketIoManager')
//@Require('socketio:server.SocketIoServer')
//@Require('socketio:server.SocketIoServerConfig')
//@Require('syncbugserver.CallService')
//@Require('syncbugserver.SyncbugController')
//@Require('syncbugserver.SyncObject')
//@Require('syncbugserver.SyncObjectManager')
//@Require('syncbugserver.SyncObjectSchema')
//@Require('syncbugserver.SyncObjectService')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var connect                 = require('connect');
var express                 = require('express');
var mongoose                = require('mongoose');
var path                    = require('path');
var synccache               = require('synccache');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var BugCallServer           = bugpack.require('bugcall.BugCallServer');
var CallServer              = bugpack.require('bugcall.CallServer');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugFs                   = bugpack.require('bugfs.BugFs');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration          = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var BugCallRouter           = bugpack.require('bugroute:bugcall.BugCallRouter');
var ExpressApp              = bugpack.require('express.ExpressApp');
var ExpressServer           = bugpack.require('express.ExpressServer');
var Handshaker              = bugpack.require('handshaker.Handshaker');
var SocketIoManager         = bugpack.require('socketio:server.SocketIoManager');
var SocketIoServer          = bugpack.require('socketio:server.SocketIoServer');
var SocketIoServerConfig    = bugpack.require('socketio:server.SocketIoServerConfig');
var CallService             = bugpack.require('syncbugserver.CallService');
var SyncbugController       = bugpack.require('syncbugserver.SyncbugController');
var SyncObject              = bugpack.require('syncbugserver.SyncObject');
var SyncObjectManager       = bugpack.require('syncbugserver.SyncObjectManager');
var SyncObjectSchema        = bugpack.require('syncbugserver.SyncObjectSchema');
var SyncObjectService       = bugpack.require('syncbugserver.SyncObjectService');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var configuration           = ConfigurationAnnotation.configuration;
var module                  = ModuleAnnotation.module;
var property                = PropertyAnnotation.property;
var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SyncbugServerConfiguration = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {{
         *      port: number,
         *      mongoDbIp: string
         * }}
         */
        this._config                = null;

        /**
         * @private
         * @type {string}
         */
        this._configFilePath        = path.resolve(__dirname, '../config.json');

        /**
         * @private
         * @type {ExpressApp}
         */
        this._expressApp            = null;

        /**
         * @private
         * @type {ExpressServer}
         */
        this._expressServer         = null;

        /**
         * @private
         * @type {mongoose}
         */
        this._mongoose              = null;

        /**
         * @private
         * @type {SocketIoServer}
         */
        this._socketIoServer        = null;

        /**
         * @private
         * @type {SocketIoServerConfig}
         */
        this._socketIoServerConfig  = null;

        /**
         * @private
         * @type {SyncbugController}
         */
        this._syncbugController     = null;

        /**
         * @private
         * @type {SyncCache}
         */
        this._syncCache             = null;
    },


    //-------------------------------------------------------------------------------
    // IConfiguration Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeConfiguration: function(callback) {
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeConfiguration: function(callback) {
        var _this = this;
        console.log("Initializing SyncbugConfiguration");

        var config = this._config;

        this._mongoose.connect('mongodb://' + config.mongoDbIp + '/syncbug');

        this._expressApp.configure(function(){
            _this._expressApp.set('port', config.port);
        });

        _this._expressApp.use(express.errorHandler());

        this._expressApp.configure('development', function() {
            _this._expressApp.use(express.logger('dev'));
        });

        this._socketIoServerConfig.setResource("/api/socket");

        $series([

            $task(function(flow) {

            }),

            //-------------------------------------------------------------------------------
            // Controllers
            //-------------------------------------------------------------------------------

            $task(function(flow) {
                _this._syncbugController.configure(function(error) {
                    if (!error) {
                        console.log("syncbugController configured");
                    }
                    flow.complete(error);
                })
            }),


            //-------------------------------------------------------------------------------
            // Apps and Servers
            //-------------------------------------------------------------------------------

            $task(function(flow){
                console.log("Initializing expressApp");

                _this._expressApp.initialize(function(error) {
                    if (!error) {
                        console.log("expressApp initialized");
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                console.log("starting expressServer");

                _this._expressServer.start(function(error) {
                    if (!error) {
                        console.log("expressServer started");
                    }
                    flow.complete(error);
                });
            }),
            $task(function(flow){
                console.log("Starting socketIoServer");

                _this._socketIoServer.start(function(error) {
                    if (!error) {
                        console.log("socketIoServer started");
                    }
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {BugCallServer} bugCallServer
     * @return {BugCallRouter}
     */
    bugCallRouter: function(bugCallServer) {
        return new BugCallRouter(bugCallServer);
    },

    /**
     * @param {CallServer} callServer
     * @return {BugCallServer}
     */
    bugCallServer: function(callServer) {
        return new BugCallServer(callServer);
    },

    /**
     * @param {SocketIoManager}
     * @return {CallServer}
     */
    callServer: function(socketIoManager) {
        return new CallServer(socketIoManager);
    },

    /**
     * @return {CallService}
     */
    callService: function(){
        return new CallService();
    },

    /**
     * @return {Object}
     */
    config: function() {
        this._config = this.loadConfig(this._configFilePath);
        return this._config;
    },

    /**
     * @param {Object} config
     * @return {ExpressServer}
     */
    expressApp: function(config) {
        this._expressApp = new ExpressApp(config);
        return this._expressApp;
    },

    /**
     * @param {ExpressApp} expressApp
     * @return {ExpressServer}
     */
    expressServer: function(expressApp) {
        this._expressServer = new ExpressServer(expressApp);
        return this._expressServer;
    },

    /**
     * @return {Handshaker}
     */
    handshaker: function() {
        this._handshaker = new Handshaker([]);
        return this._handshaker;
    },

    /**
     * @return {Mongoose}
     */
    mongoose: function() {
        this._mongoose = mongoose;
        return this._mongoose;
    },

    /**
     * @param {SocketIoServer} socketIoServer
     * @return {SocketIoManager}
     */
    socketIoManager: function(socketIoServer) {
        return new SocketIoManager(socketIoServer, '/api/client');
    },

    /**
     * @param {SocketIoServerConfig} config
     * @param {ExpressServer} expressServer
     * @return {SocketIoServer}
     */
    socketIoServer: function(config, expressServer, handshaker) {
        this._socketIoServer = new SocketIoServer(config, expressServer, handshaker);
        return this._socketIoServer;
    },

    /**
     * @return {SocketIoServerConfig}
     */
    socketIoServerConfig: function() {
        this._socketIoServerConfig = new SocketIoServerConfig({});
        return this._socketIoServerConfig;
    },

    /**
     * @param {BugCallRouter} bugCallRouter
     * @param {SyncObjectService} syncObjectService
     * @return {SyncbugController}
     */
    syncbugController: function(bugCallRouter, syncObjectService) {
        this._syncbugController = new SyncbugController(bugCallRouter, syncObjectService);
        return this._syncbugController;
    },

    /**
     * @return {SyncCache}
     */
    syncCache: function() {
        this._syncCache = synccache;
        return this._syncCache;
    },

    /**
     * @return {SyncObject}
     */
    syncObject: function() {
        return SyncObject;
    },

    /**
     * @param {SyncObject} model
     * @param {SyncObjectSchema} schema
     * @return {SyncObjectManager}
     */
    syncObjectManager: function(model, schema) {
        return new SyncObjectManager(model, schema);
    },

    /**
     * @return {SyncObjectSchema}
     */
    syncObjectSchema: function() {
        return SyncObjectSchema;
    },

    /**
     * @param {BugCallServer} bugCallServer
     * @param {CallService} callService
     * @param {SyncCache} syncCache
     * @param {SyncObjectManager} syncObjectManager
     * @return {SyncObjectService}
     */
    syncObjectService: function(bugCallServer, callService, syncCache, syncObjectManager) {
        return new SyncObjectService(bugCallServer, callService,  syncCache, syncObjectManager);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /*
     * @private
     * @param {?string=} configPath
     * @return {{
     *      port: number,
     *      mongoDbIp: string
     * }}
     **/
    loadConfig: function(configPath){
        var config;
        var defaults = {
            port: 8000,
            mongoDbIp: "localhost"
        };

        if (BugFs.existsSync(configPath)) {
            try {
                config = JSON.parse(BugFs.readFileSync(configPath, 'utf8'));
            } catch(error) {
                console.log(configPath, "could not be parsed. Invalid JSON.");
                return defaults;
            } finally {
                return config;
            }
        } else {
            return defaults;
        }
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(SyncbugServerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(SyncbugServerConfiguration).with(
    configuration("syncbugServerConfiguration").modules([


        //-------------------------------------------------------------------------------
        // Common
        //-------------------------------------------------------------------------------

        module("config"),
        module("mongoose"),


        //-------------------------------------------------------------------------------
        // Express
        //-------------------------------------------------------------------------------

        module("expressApp")
            .args([
                arg().ref("config")
            ]),
        module("expressServer")
            .args([
                arg().ref("expressApp")
            ]),


        //-------------------------------------------------------------------------------
        // Util
        //-------------------------------------------------------------------------------

        module("handshaker"),


        //-------------------------------------------------------------------------------
        // Sockets
        //-------------------------------------------------------------------------------

        module("socketIoManager")
            .args([
                arg().ref("socketIoServer")
            ]),
        module("socketIoServer")
            .args([
                arg().ref("socketIoServerConfig"),
                arg().ref("expressServer"),
                arg().ref("handshaker")
            ]),
        module("socketIoServerConfig"),


        //-------------------------------------------------------------------------------
        // BugCall
        //-------------------------------------------------------------------------------

        module("bugCallRouter")
            .args([
                arg().ref("bugCallServer")
            ]),
        module("bugCallServer")
            .args([
                arg().ref("callServer")
            ]),
        module("callServer")
            .args([
                arg().ref("socketIoManager")
            ]),


        //-------------------------------------------------------------------------------
        // Controllers
        //-------------------------------------------------------------------------------

        module("syncbugController")
            .args([
                arg().ref("bugCallRouter"),
                arg().ref("syncObjectService")
            ]),


        //-------------------------------------------------------------------------------
        // Services
        //-------------------------------------------------------------------------------

        module("callService"),
        module("syncObjectService")
            .args([
                arg().ref("bugCallServer"),
                arg().ref("callService"),
                arg().ref("syncCache"),
                arg().ref("syncObjectManager")
            ]),


        //-------------------------------------------------------------------------------
        // Managers
        //-------------------------------------------------------------------------------

        module("syncObjectManager")
            .args([
                arg().ref("syncObject"),
                arg().ref("syncObjectSchema")
            ]),
        

        //-------------------------------------------------------------------------------
        // Models
        //-------------------------------------------------------------------------------

        module("syncObject"),


        //-------------------------------------------------------------------------------
        // Schemas
        //-------------------------------------------------------------------------------

        module("syncObjectSchema")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("syncbugserver.SyncbugServerConfiguration", SyncbugServerConfiguration);
