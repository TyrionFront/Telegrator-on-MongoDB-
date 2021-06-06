module.exports = async (req, res) => {
  const { count } = req.params;
  const [skipCount = 0] = req.flash('skipCount');
  req.flash('countAndLimit', { skipCount: skipCount - Number(count), currentLimit: Number(count) });
  res.redirect('/');
};
