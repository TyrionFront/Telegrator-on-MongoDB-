const User = require('../models/User');
const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
  const { userId } = req.session;
  let blogPosts = [];
  const [countAndLimit = {}] = req.flash('countAndLimit');
  const { skipCount = 0, currentLimit = 5 } = countAndLimit;
  let hideFresherBtn = true;
  let hideOlderBtn = false;

  if (userId) {
    const { username } = await User.findById(userId);
    const pendindResult = BlogPost.aggregate([
      { $match: { username } },
      { $sort: { date: -1 } },
    ]);
    blogPosts = currentLimit === 'All' ? await pendindResult
      : await pendindResult.skip(skipCount)
        .limit(currentLimit);
    hideFresherBtn = skipCount < currentLimit;
    hideOlderBtn = skipCount > currentLimit && blogPosts.length < currentLimit;
  }

  req.flash('skipCount', skipCount);
  res.render('home', {
    blogPosts, currentLimit, hideFresherBtn, hideOlderBtn,
  });
};
