const mongoose =
require("mongoose");

const sessionSchema =
new mongoose.Schema({

  startTime: String,

  endTime: String,

  slotDuration: Number,

  maxPatients: {
    type: Number,
    default: 20,
  },

  consultationType: {
    type: String,
    enum: [
      "Online",
      "Offline",
      "Both",
    ],
    default: "Offline",
  },

});
const daySchema =
new mongoose.Schema({
  day: String,

  sessions: [
    sessionSchema,
  ],
});

const doctorAvailabilitySchema =
new mongoose.Schema(
  {
    doctorId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    availability: [
      daySchema,
    ],
  },
  {
    timestamps: true,
  }
);

module.exports =
mongoose.model(
  "DoctorAvailability",
  doctorAvailabilitySchema
);