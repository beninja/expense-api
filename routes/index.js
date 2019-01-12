module.exports = function(server) {

  require('./expense.route')(server);
  require('./type.route')(server);

};
