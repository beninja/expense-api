require('dotenv').config()
/**
 * Module Dependencies
 */
const config = require('./config');
const restify = require('restify');
const mongoose = require('mongoose');
const restifyPlugins = require('restify-plugins');
const corsMiddleware = require('restify-cors-middleware');
const Expense = require('./models/expense');
const CronJob = require('cron').CronJob;
const moment = require('moment');
const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['*']
})
/**
  * Initialize Server
  */
const server = restify.createServer({
	name: config.name,
	version: config.version,
});

server.pre(cors.preflight)
server.use(cors.actual)

/**
  * Middleware
  */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

/**
  * Start Server, Connect to DB & Require Routes
  */
server.listen(config.port, () => {
	// establish connection to mongodb
	mongoose.Promise = global.Promise;
	mongoose.connect(config.db.uri, { useMongoClient: true });

	const db = mongoose.connection;

	db.on('error', (err) => {
	    console.error(err);
	    process.exit(1);
	});

	db.once('open', () => {

    new CronJob('0 0 0 * * *', function() {
      const day = moment().date();
      console.log('day is', day);
      Expense.find({
        recursive: day
      }).then((expenses) => {
        if (expenses.length > 0) {
          expenses.forEach((expense) => {
            const newExpense = new Expense({
              value: expense.value,
              comment: expense.comment
            })
            newExpense.save();
          })
        }
      })

    }, null, true, 'Europe/Paris');

    require('./routes')(server);
    console.log(`Server is listening on port ${config.port}`);
	});
});
