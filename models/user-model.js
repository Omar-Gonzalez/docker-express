const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  'email': {type: String, required: true, unique: true},
  'password': {type: String, required: true},
  'role': {type: String, default: 'user'}
});

const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel;