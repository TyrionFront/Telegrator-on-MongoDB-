const User = require('../models/User');

module.exports = (req, res, next) => {
  User.findById(req.session.userId, (err, user) => {
    if (err || !user) {
      res.redirect('/');
      return;
    }
    next();
  });
};
