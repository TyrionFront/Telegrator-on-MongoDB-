module.exports = (req, res) => {
  const { query } = req;
  if (query.username) {
    res.render('login', {
      error: req.flash('validationError')[0],
      username: query.username,
      password: query.password,
    });
    return;
  }
  const [data = {}] = req.flash('data');
  const { username = '', password = '' } = data;
  res.render('login', {
    error: req.flash('validationError')[0],
    username,
    password,
  });
};
