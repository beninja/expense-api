/**
 * Module Dependencies
 */
const errors = require('restify-errors');

/**
 * Model Schema
 */
const Expense = require('../models/expense');

module.exports = function(server) {
  /**
   * POST
   */
  server.post('/expenses', (req, res, next) => {
    if (!req.is('application/json')) {
      return next(
        new errors.InvalidContentError("Expects 'application/json'"),
      );
    }

    let data = req.body || {};

    let expense = new Expense(data);
    expense.save(function(err) {
      if (err) {
        console.error(err);
        return next(new errors.InternalError(err.message));
        next();
      }

      res.send(201);
      next();
    });
  });

  /**
   * LIST
   */
  server.get('/expenses', (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    Expense.find({})
      .populate('_type')
      .limit(limit)
      .skip(offset)
      .sort({
        createdAt: -1
      })
      .then((docs) => {
        res.send(docs);
        next();
      },
      (err) => {
        console.error(err);
        return next(
          new errors.InvalidContentError(err.errors.name.message),
        );
      }
    );
  });

  /**
   * GET
   */
  server.get('/expenses/:expense_id', (req, res, next) => {
    Expense.findOne({ _id: req.params.expense_id }, function(err, doc) {
      if (err) {
        console.error(err);
        return next(
          new errors.InvalidContentError(err.errors.name.message),
        );
      }

      res.send(doc);
      next();
    });
  });

  /**
   * UPDATE
   */
  server.put('/expenses/:expense_id', (req, res, next) => {
    if (!req.is('application/json')) {
      return next(
        new errors.InvalidContentError("Expects 'application/json'"),
      );
    }

    let data = req.body || {};

    if (!data._id) {
      data = Object.assign({}, data, { _id: req.params.expense_id });
    }

    Expense.findOne({ _id: req.params.expense_id }, function(err, doc) {
      if (err) {
        console.error(err);
        return next(
          new errors.InvalidContentError(err.errors.name.message),
        );
      } else if (!doc) {
        return next(
          new errors.ResourceNotFoundError(
            'The resource you requested could not be found.',
          ),
        );
      }

      Expense.update({ _id: data._id }, data, function(err) {
        if (err) {
          console.error(err);
          return next(
            new errors.InvalidContentError(err.errors.name.message),
          );
        }

        res.send(200, data);
        next();
      });
    });
  });

  /**
   * DELETE
   */
  server.del('/expenses/:expense_id', (req, res, next) => {
    Expense.deleteOne({ _id: req.params.expense_id }, function(err) {
      if (err) {
        console.error(err);
        return next(
          new errors.InvalidContentError(err.errors.name.message),
        );
      }

      res.send(204);
      next();
    });
  });
}
