/* eslint-disable consistent-return */
const User = require('../models/User');
const { getErrDescriptions } = require('../utils/processErr');

module.exports = (req, res) => {
  User.create(req.body, (err) => {
    if (err) {
      req.flash('validationErrors', getErrDescriptions(err));
      req.flash('data', req.body);
      return res.redirect('/auth/register');
    }
    res.redirect('/');
  });
};
