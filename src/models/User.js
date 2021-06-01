const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please, provide user name'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please, provide password'],
  },
});

UserSchema.plugin(uniqueValidator);

// eslint-disable-next-line func-names
UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
