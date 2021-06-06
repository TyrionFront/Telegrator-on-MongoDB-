module.exports = async (req, res) => {
  const { count } = req.body;
  req.flash('countAndLimit', { currentLimit: Number(count), skipCount: 0 });
  res.redirect('/');
};
