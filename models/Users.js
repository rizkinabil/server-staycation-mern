const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bycrypt.hash(user.password, 8);
  }
});

module.exports = mongoose.model('Users', userSchema);
