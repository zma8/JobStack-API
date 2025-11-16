const express = require('express');
const router = express.Router();
const User = require('../models/user');
const FreelancerProfile = require('../models/FreelancerProfile');

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/current-user', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
   
    if (user.role === 'freelancer') {
      const freelancerProfile = await FreelancerProfile.findOne({ userId: user._id });
      const userWithProfile = {
        ...user.toObject(),
        freelancerProfile: freelancerProfile
      };
      return res.json(userWithProfile);
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    // If user is a freelancer, get their profile
    if (user.role === 'freelancer') {
      const freelancerProfile = await FreelancerProfile.findOne({ userId: user._id });
      const userWithProfile = {
        ...user.toObject(),
        freelancerProfile: freelancerProfile
      };
      return res.json(userWithProfile);
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.put('/:id/skills', async (req, res) => {
  try {
    const { skills } = req.body;
    
    // Check if user is updating their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ err: 'Not authorized' });
    }

    // Find or create freelancer profile
    let freelancerProfile = await FreelancerProfile.findOne({ userId: req.params.id });
    
    if (!freelancerProfile) {
      // Create new profile if doesn't exist
      freelancerProfile = new FreelancerProfile({
        userId: req.params.id,
        skills: skills
      });
    } else {
      // Update existing profile
      freelancerProfile.skills = skills;
    }

    await freelancerProfile.save();

    // Return updated user with freelancer profile
    const user = await User.findById(req.params.id).select('-hashedPassword');
    const userWithProfile = {
      ...user.toObject(),
      freelancerProfile: freelancerProfile
    };

    res.json({ data: userWithProfile });
  } catch (error) {
    res.status(500).json({ err: 'Server error' });
  }
});

router.post('/:id/profile', async (req, res) => {
  try {
    const { skills } = req.body;
    let existing = await FreelancerProfile.findOne({ userId: req.params.id });
    if (existing) return res.status(400).json({ err: 'Profile already exists' });
    const profile = await FreelancerProfile.create({
      userId: req.params.id,
      skills
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:id/profile', async (req, res) => {
  try {
    const profile = await FreelancerProfile.findOne({ userId: req.params.id });
    if (!profile) return res.status(404).json({ err: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put('/:id/profile', async (req, res) => {
  try {
    const { skills } = req.body;
    const profile = await FreelancerProfile.findOneAndUpdate(
      { userId: req.params.id },
      { skills },
      { new: true }
    );
    if (!profile) return res.status(404).json({ err: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete('/:id/profile', async (req, res) => {
  try {
    const profile = await FreelancerProfile.findOneAndDelete({ userId: req.params.id });
    if (!profile) return res.status(404).json({ err: 'Profile not found' });
    res.json({ message: 'Profile deleted', profile });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;