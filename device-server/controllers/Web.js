'use strict';

var url = require('url');

var Web = require('./WebService');

module.exports.web = function web (req, res, next) {
  Web.web(req.swagger.params, res, next);
};
