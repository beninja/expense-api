const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const ExpenseSchema = new mongoose.Schema(
	{
    _type: {
      type: Schema.Types.ObjectId,
      ref: 'Type',
    },
		value: {
			type: Number,
			required: true
		},
    comment: {
			type: String
		},
    recursive: {
      type: Number,
      min: 1,
      max: 31
    }
	},
	{ minimize: false },
);

ExpenseSchema.plugin(timestamps);

const Expense = mongoose.model('Expense', ExpenseSchema);
module.exports = Expense;
