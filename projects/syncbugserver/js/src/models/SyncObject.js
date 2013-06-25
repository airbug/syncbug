//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbugserver')

//@Export('SyncObject')

//@Require('syncbugserver.SyncObjectSchema')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Bugpack 
//-------------------------------------------------------------------------------

var SyncObjectSchema  = bugpack.require('syncbugserver.SyncObjectSchema');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SyncObject = mongoose.model("SyncObject", SyncObjectSchema);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbugserver.SyncObject', SyncObject);