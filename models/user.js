const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ['admin', 'client', 'freelancer'],
    require: true,
  },
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;