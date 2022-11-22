const { Schema, model } = require("mongoose");

const mementoSchema = new Schema({
  name: String,
  description: {
    type: String,
    required: true,
  
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ownerCity: {
    type: Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
},
{
    timestamps:true
}
);

module.exports = model("Memento", mementoSchema);
