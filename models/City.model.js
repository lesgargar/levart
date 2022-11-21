const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const citySchema = new Schema(
  {
    name: String,
    location: String,
    image: {
      type:String,
      default: "/images/sunrise-1014712__480.jpg"
    },
    review:{
      type: [{
        type:Schema.Types.ObjectId, 
        ref:"Review"
      }]
    },
    memento:{
      type:[{
        type:Schema.Types.ObjectId,
        ref:"memento"
      }]
    }

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const City = model("City", citySchema);

module.exports = City;
