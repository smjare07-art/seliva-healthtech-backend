const mongoose = require("mongoose");

const predictionSchema =
new mongoose.Schema(
{
  patientId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  conductivity:Number,
  oxygen:Number,
  methane:Number,
  ammonia:Number,

  disease:String,

  healthScore: {
  type: Number
},

healthStatus: {
  type: String
},

description: {
  type: String
},
},
{
  timestamps:true
}
);

module.exports =
mongoose.model(
  "Prediction",
  predictionSchema
);