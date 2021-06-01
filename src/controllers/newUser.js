module.exports = (req, res) => {
  const [data = {}] = req.flash('data');
  const { username = '', password = '' } = data;
  res.render('register', {
    errors: req.flash('validationErrors'),
    username,
    password,
  });
};
