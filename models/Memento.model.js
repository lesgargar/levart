const {Schema, model} = require("mongoose");

const mementoSchema = new Schema(
    {
    name:String,
    description:{
        type:String,
        required: true,
        minlength: 20
        },
    }
);

module.exports = model("Memento", mementoSchema);