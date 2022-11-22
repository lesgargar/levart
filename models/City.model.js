const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const citySchema = new Schema(
  {
    name: String,
    location: String,
    description:String,
    image: {
      type:String,
      default: "https://cdn.pixabay.com/photo/2022/10/24/18/10/street-7544046_960_720.jpg"
    },
    owner:{
      type: Schema.Types.ObjectId,
      ref:"User"
    }

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const City = model("City", citySchema);

module.exports = City;
