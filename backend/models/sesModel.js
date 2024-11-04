var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sesSchema = new Schema({
	'originalFileName': String,
	'tableName': String,
    'type': String,
    'date': Date,
    'filePath': String,
    'pokerstarsUsername': String,
    'blinds': String,
    'bb': Number,
	'userId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
    'hands': Number,
	'profit': Number,
    'bbprofit': Number,
	'call': Number,
	'raise': Number,
	'fold': Number,
    'bet': Number,
    'threeBet': Number,
	'showdown': Number,
    'wonShowdown': Number,
    'vpip': Number,
    'pfr': Number,
    'agg_percent': Number,
    'wtsd_percent': Number,
    'wonsd_percent': Number,
    'vpip_percent': Number,
    'pfr_percent': Number,

}, {timestamps: true});


module.exports = mongoose.model('ses', sesSchema);