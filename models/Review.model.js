const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: true,
      trim: true
    },
    owner:{
      type: Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    ownerCity: {
      type: Schema.Types.ObjectId,
      ref:"City",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      trim: true,
      minLength: 5
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
