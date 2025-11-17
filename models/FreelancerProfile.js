const mongoose = require('mongoose');

const freelancerProfileSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
    unique: true,
  },
  skills: {
    type: [String],
    require: true,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const FreelancerProfile = mongoose.model('FreelancerProfile', freelancerProfileSchema);

module.exports = FreelancerProfile;
