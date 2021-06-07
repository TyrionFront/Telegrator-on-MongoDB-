const User = require('../models/User');
const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
  const { userId } = req.session;
  let blogPosts = [];
  const [countAndLimit = {}] = req.flash('countAndLimit');
  const { skipCount = 0, currentLimit = 5 } = countAndLimit;
  const limitValue = currentLimit === 'All' ? currentLimit : Number(currentLimit);
  let hideFresherBtn = true;
  let hideOlderBtn = true;

  if (!userId) {
    res.render('home', {
      blogPosts, currentLimit: 'All', hideFresherBtn, hideOlderBtn,
    });
    return;
  }

  const { username } = await User.findById(userId);
  const pendindResult = BlogPost.aggregate([
    { $match: { username } },
    { $sort: { date: -1 } },
  ]);

  blogPosts = await pendindResult;

  if (limitValue !== 'All') {
    blogPosts = await pendindResult.skip(skipCount).limit(limitValue);
    hideFresherBtn = skipCount < limitValue;
    hideOlderBtn = skipCount > limitValue && blogPosts.length < limitValue;
  }

  req.flash('skipCount', skipCount);
  res.render('home', {
    blogPosts, currentLimit: limitValue, hideFresherBtn, hideOlderBtn,
  });
};
