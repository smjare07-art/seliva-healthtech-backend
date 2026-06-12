const mongoose = require("mongoose");

const sessionSchema =
  new mongoose.Schema({
    startTime: String,
    endTime: String,

    slotDuration: {
      type: Number,
      default: 30,
    },

    maxPatients: Number,

    consultationType: {
      type: String,
      enum: [
        "Offline",
        "Online",
        "Both",
      ],
      default: "Offline",
    },
  });

const availabilitySchema =
  new mongoose.Schema(
    {
      doctorId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      availability: [
        {
          day: String,

          sessions: [
            sessionSchema,
          ],
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Availability",
    availabilitySchema
  );