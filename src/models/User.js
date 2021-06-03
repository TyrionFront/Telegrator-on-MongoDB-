/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
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

UserSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;
    next();
  });
});
UserSchema.post('updateOne', async function () {
  const user = this;
  const { password } = user._update.$set;
  bcrypt.hash(password, 10, async (err, hash) => {
    await this.model.findOneAndUpdate({ password }, { password: hash });
  });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
