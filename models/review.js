const mongoose=require ('mongoose');

const reviewSchema=mongoose.Schema({
    freelancerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,
    },
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,
    },
    rating:{
        type:Number,
        require:true,
        min:1,
        max:5,
    },
    comment:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

const Review=mongoose.model('Review',reviewSchema);

module.exports=Review;