const express = require('express');
// eslint-disable-next-line no-unused-vars
const ejs = require('ejs');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');

const redirectIfAuthenticated = require('./middlewares/redirectIfAuthenticated');

const homeController = require('./controllers/home');
const getPostController = require('./controllers/getPost');
const storePostController = require('./controllers/storePost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const getLimitedUsersListController = require('./controllers/limitCount');
const prevPostsController = require('./controllers/prevList');
const nextPostsController = require('./controllers/nextList');
const logoutController = require('./controllers/logout');

dotenv.config();
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.locals.loggedInId = null;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(expressSession({
  secret: 'Valar Morghulis',
  saveUninitialized: true,
}));
app.use((req, res, next) => {
  app.locals.loggedInId = req.session.userId;
  next();
});
app.use(flash());

app.get('/', homeController);
app.get('/post/:id', getPostController);
app.post('/bot', storePostController);
app.get('/auth/register', redirectIfAuthenticated, newUserController);
app.post('/users/register', redirectIfAuthenticated, storeUserController);
app.get('/auth/login', redirectIfAuthenticated, loginController);
app.post('/users/login', redirectIfAuthenticated, loginUserController);
app.post('/users/limited', getLimitedUsersListController);
app.get('/posts/fresher/:count', prevPostsController);
app.get('/posts/older/:count', nextPostsController);
app.get('/auth/logout', logoutController);
app.use((req, res) => res.render('notfound'));

module.exports = app;
