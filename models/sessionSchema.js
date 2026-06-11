const sessionSchema =
new mongoose.Schema({

  startTime: String,

  endTime: String,

  slotDuration: Number,

  maxPatients: Number,

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