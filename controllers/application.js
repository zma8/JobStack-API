const express = require('express');
const router = express.Router();

const Application = require('../models/Application.js');
const Job = require('../models/Job.js');

// Creat Bid / Application
router.post('/', async (req, res) => {
  try {
    const { jobId, amount, message } = req.body; 
    const freelancerId = req.user._id; 

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

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

// VIEW BIDS for specific job
router.get('/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    const bids = await Application.find({ jobId })
      .populate('freelancerId', 'name email') 
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ACCEPT a Bid
router.patch('/:bidId/accept', async (req, res) => {
  try {
    const { bidId } = req.params;
    const userId = req.user._id; 

    // Find the bid
    const bid = await Application.findById(bidId);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Find the related job and check the owner
    const job = await Job.findById(bid.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Ensure the user is the owner of the job
    if (job.owner.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Only the job owner can accept a bid' });
    }

    // Mark the selected bid as accepted
    bid.status = 'accepted';
    await bid.save();

    // Reject all other bids for this job
    await Application.updateMany(
      { jobId: bid.jobId, _id: { $ne: bidId } },
      { status: 'rejected' }
    );

    // 6) Update job status
    job.status = 'in-progress';
    await job.save();

    res.json({
      message: 'Bid accepted and all other bids were automatically rejected.',
      acceptedBid: bid,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;