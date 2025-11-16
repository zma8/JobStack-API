const Job = require('../models/Job.js');
const Application = require('../models/Application.js');
const express = require('express');
const router = express.Router();

// Create a New job
router.post('/', async (req, res) => {
  try {

    const owner = req.user._id;

    const createdJob = await Job.create({
      ...req.body,
      owner
    });

    res.status(201).json(createdJob);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Display all Jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('owner')
      .populate({
        path: 'bids',
        populate: {
          path: 'freelancerId',
          select: 'username'
        }
      });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// FILTER jobs by category
router.get('/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;

    // Check if category is valid
    const validCategories = [
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
    ];

    if (!validCategories.includes(categoryName)) {
      return res.status(400).json({ error: "Invalid category name" });
    }

    const jobs = await Job.find({ category: categoryName })
      .populate("owner")
      .populate("bids");

    res.status(200).json(jobs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Display specific job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('owner')
      .populate({
        path: 'bids',
        populate: {
          path: 'freelancerId',
          select: 'username role'
        }
      });
      
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a jobs
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
  