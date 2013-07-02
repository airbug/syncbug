//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('syncbugserver')

//@Export('SyncObjectSchema')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();
var mongoose    = require('mongoose');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var Schema      = mongoose.Schema;
var Mixed       = mongoose.Schema.Types.Mixed;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SyncObjectSchema = new Schema({
    object: {
        type: Mixed,
        required: true
    },
    syncKey: {
        type: String,
        require: true,
        unique: true
    }
});

SyncObjectSchema.index({
    syncKey: 1
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('syncbugserver.SyncObjectSchema', SyncObjectSchema);
