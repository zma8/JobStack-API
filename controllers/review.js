const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const FreelancerProfile = require('../models/FreelancerProfile');

router.post('/',async(requestAnimationFrame,res)=>{
    try{
        const {freelancelId,clientId,rating,comment}=requestAnimationFrame.body;

        const newReview=await Review.create({
            freelancelId,
            clientId,
            rating,
            comment
        });

        const allReviews=await Review.find({freelancelId});
        const avgRating=allReviews.reduce((sum,r)=>sum +r.rating,0)/allReviews.length;

        await FreelancerProfile.findOneAndUpdate(
            {
                userId:freelancelId
            },
            {
                averageRating:avgRating.toFixed(1)

            }
        );
        
        res.status(201).json(newReview);

    }catch(err){
         console.error(err);
         res.status(500).json({ error: err.message });
    }
});

router.get('/freelancer/:freelancerId',async (req,res)=>{
    try{
        const {freelancelId}=req.params;

        const reviews=await Review.find({freelancelId}).populate('clientId','username');

        const freelancerProfile=await FreelancerProfile.findOne({userId:freelancelId});
        const averageRating=freelancerProfile?freelancerProfile.averageRating:0;

        res.json({
            reviews,
            averageRating,
            totalReviews:reviews.length
        });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:reviewId',async(req,res)=>{
    try{
        const {reviewId}=req.params;

        const review=await Review.findById(reviewId).populate('freelancerId','username').populate('clientId','username');

        if(!review){
            return res.status(404).json({error:'Review not found'});
        }

        res.json(review);
    }catch(err){
     console.error(err);
    res.status(500).json({ error: err.message });
    }
});

module.exports=router;