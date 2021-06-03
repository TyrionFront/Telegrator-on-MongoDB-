module.exports = (req, res) => {
  const { username, password } = req.query;
  res.render('register', {
    errors: req.flash('validationErrors'),
    username,
    password,
  });
};
