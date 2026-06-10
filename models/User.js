const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Information

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

    role: {
      type: String,
      enum: [
        "admin",
        "doctor",
        "patient",
      ],
      default: "patient",
    },

    // Auth

    resetToken: String,

    resetTokenExpire: Date,

    otp: String,

    otpExpire: Date,

    // Common Profile

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    profileImage: {
      type: String,
      default: "",
    },

    dob: Date,

    gender: String,

    address: String,

    city: String,

    state: String,

    pincode: String,

    // Patient Fields

    bloodGroup: String,

    height: String,

    weight: String,

    emergencyContact: String,

    occupation: String,

    maritalStatus: String,

    smoking: {
      type: Boolean,
      default: false,
    },

    alcohol: {
      type: Boolean,
      default: false,
    },

    diabetes: {
      type: Boolean,
      default: false,
    },

    bloodPressure: {
      type: Boolean,
      default: false,
    },

    heartDisease: {
      type: Boolean,
      default: false,
    },

    allergies: String,

    medications: String,

    familyHistory: String,

    // Doctor Fields

    qualification: String,

    specialization: String,

    registrationNumber:
      String,

    experience: String,

    hospitalName: String,

    designation: String,

    consultationFee:
      String,

    about: String,

    languages: String,

    licenseImage: {
      type: String,
      default: "",
    },

    degreeCertificate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "User",
    userSchema
  );