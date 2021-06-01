module.exports = (req, res) => {
  const [data = {}] = req.flash('data');
  const { username = '', password = '' } = data;
  res.render('login', {
    error: req.flash('validationError')[0],
    username,
    password,
  });
};
