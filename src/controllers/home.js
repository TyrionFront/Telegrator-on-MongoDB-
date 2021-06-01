const User = require('../models/User');
const BlogPost = require('../models/BlogPost');

module.exports = async (req, res) => {
  const { userId } = req.session;
  let blogPosts = [];
  if (userId) {
    const { username } = await User.findById(userId);
    blogPosts = (await BlogPost.find({ username })).reverse();
  }
  res.render('home', { blogPosts });
};
