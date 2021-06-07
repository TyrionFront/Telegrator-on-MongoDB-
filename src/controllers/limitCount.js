module.exports = async (req, res) => {
  const { count } = req.body;
  const [skipCount = 0] = req.flash('skipCount');
  req.flash('countAndLimit', { currentLimit: count, skipCount });
  res.redirect('/');
};
