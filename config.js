module.exports = {
	name: 'ExpenseApi',
	env: process.env.NODE_ENV || 'dev',
	port: process.env.PORT || 8080,
	base_url: process.env.BASE_URL || 'http://localhost:8080',
	db: {
		uri: process.env.MONGODB_URI,
	},
};
