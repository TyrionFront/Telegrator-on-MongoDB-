/* eslint-disable consistent-return */
const User = require('../models/User');
const { getErrDescriptions } = require('../utils/processErr');

module.exports = (req, res) => {
  req.flash('data', req.body);
  User.create(req.body, (err) => {
    if (err) {
      req.flash('validationErrors', getErrDescriptions(err));
      return res.redirect('/auth/register');
    }
    res.redirect('/auth/login');
  });
};
