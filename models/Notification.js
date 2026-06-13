const mongoose =
require("mongoose");

const notificationSchema =
new mongoose.Schema(
{
  userId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },

  title:{
    type:String,
  },

  message:{
    type:String,
  },

  isRead:{
    type:Boolean,
    default:false,
  },

  appointmentId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"Appointment",
  },

},
{
  timestamps:true,
}
);

module.exports =
mongoose.model(
  "Notification",
  notificationSchema
);