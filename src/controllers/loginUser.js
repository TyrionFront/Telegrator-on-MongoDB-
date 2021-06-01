/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const User = require('../models/User');
// const { getErrDescriptions } = require('../utils/processErr');

module.exports = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (nameErr, user) => {
    if (!user) {
      req.flash('validationError', `User ${username} not found !`);
      req.flash('data', req.body);
      res.redirect('/auth/login');
      return;
    }
    bcrypt.compare(password, user.password, (passwordErr, isSame) => {
      if (!isSame) {
        req.flash('validationError', `Wrong password for user ${username}`);
        req.flash('data', req.body);
        res.redirect('/auth/login');
        return;
      }
      req.session.userId = user._id;
      res.redirect('/');
    });
  });
};
