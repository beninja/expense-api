const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const TypeSchema = new mongoose.Schema(
	{
	  name: {
	    type: String,
			required: true
	  },
		logo: {
			type: String,
			required: true
		}
	},
	{ minimize: false },
);

TypeSchema.plugin(timestamps);

const Type = mongoose.model('Type', TypeSchema);
module.exports = Type;
