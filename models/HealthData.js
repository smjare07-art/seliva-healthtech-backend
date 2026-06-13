const mongoose =
require("mongoose");

const schema =
new mongoose.Schema({

  patientId:{
    type:
      mongoose.Schema.Types.ObjectId,
    ref:"User",
  },

  conductivity:Number,

  oxygen:Number,

  methane:Number,

  ammonia:Number,

  prediction:String,

},{
  timestamps:true,
});

module.exports =
mongoose.model(
  "HealthData",
  schema
);