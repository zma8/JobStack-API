const Job = require('../models/Job.js');
const Application = require('../models/Application.js');
const express = require('express');
const router = express.Router();

// Create a New job
router.post('/', async (req, res) =>{
    try {
        const createdJob = await Job.create(req.body);
        res.status(201).json(createdJob);
    } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Display all Jops
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().populate('owner').populate('bids');
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
  