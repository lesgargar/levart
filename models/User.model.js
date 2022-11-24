const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3 
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3
    },
    username: {
      type: String,
      minLength: 3,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Date,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8
    },
    image: {
      type:String,
      default: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
