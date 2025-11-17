const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const FreelancerProfile = require('../models/FreelancerProfile');

const router = express.Router();

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) {
      return res.status(409).json({
        err: 'Username or Password is invalid',
      });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.hashedPassword = hashedPassword;

    const newUser = await User.create(req.body);


    let freelancerProfile = null;
    if (newUser.role === 'freelancer') {
      freelancerProfile = await FreelancerProfile.create({
        userId: newUser._id,
        skills: [],
        averageRating: 0
      });
    }

    const payload = {
      username: newUser.username,
      _id: newUser._id,
      role: newUser.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    const userResponse = {
      ...newUser.toObject(),
      freelancerProfile: freelancerProfile
    };

    res.json({ token, user: userResponse });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Something went wrong!' });
  }
});

router.post('/sign-in', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (!userInDatabase) {
      return res.status(401).json({ err: 'Username or Password is invalid' });
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.hashedPassword);

    if (!validPassword) {
      return res.status(401).json({ err: 'Username or Password is invalid' });
    }


    let freelancerProfile = null;
    if (userInDatabase.role === 'freelancer') {
      freelancerProfile = await FreelancerProfile.findOne({ userId: userInDatabase._id });
    }

    const payload = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
      role: userInDatabase.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);


    const userResponse = {
      ...userInDatabase.toObject(),
      freelancerProfile: freelancerProfile
    };

    res.json({ token, user: userResponse });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Invalid Username or Password' });
  }
});

module.exports = router;