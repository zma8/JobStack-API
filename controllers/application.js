const express = require('express');
const router = express.Router();

const Application = require('../models/Application.js');
const Job = require('../models/Job.js');

// Creat Bid / Application
router.post('/', async (req, res) => {
  try {
    const { jobId, freelancerId, amount, message } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Create new bid
    const application = await Application.create({
      jobId,
      freelancerId,
      amount,
      message
    });

    job.bids.push(application._id);
    await job.save();

    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;