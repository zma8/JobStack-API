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