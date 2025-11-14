const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  budget: {
    type: Number,
    min: 0,
    required: true,
  },

  category: {
    type: String,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX Design",
      "Graphic Design",
      "Writing & Translation",
      "Digital Marketing",
      "Video & Animation",
      "Music & Audio",
      "Business",
      "Data & Analytics",
      "AI & Machine Learning",
      "Game Development",
      "Software Testing",
      "Cybersecurity",
      "Other"
    ],
    required: true
  },

  status: {
    type: String,
    enum: ["Open", "Close", "in-progress"],
    default: "Open",
    required: true,
  },

  bids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
  }],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);
module.exports = Job;