const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
      resetToken: String,
resetTokenExpire: Date,
otp: String,
otpExpire: Date,
dob: Date,
gender: String,
bloodGroup: String,
height: String,
weight: String,
address: String,
city: String,
state: String,
pincode: String,
emergencyContact: String,
occupation: String,
maritalStatus: String,
smoking: Boolean,
alcohol: Boolean,
diabetes: Boolean,
bloodPressure: Boolean,
heartDisease: Boolean,
allergies: String,
medications: String,
familyHistory: String,
profileCompleted: {
  type: Boolean,
  default: false,
},
profileImage: {
  type: String,
  default: "",
},
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);