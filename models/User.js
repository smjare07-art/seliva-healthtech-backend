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
    
qualification: {
  type: String,
  default: "",
},

specialization: {
  type: String,
  default: "",
},

registrationNumber: {
  type: String,
  default: "",
},

experience: {
  type: String,
  default: "",
},

hospitalName: {
  type: String,
  default: "",
},

designation: {
  type: String,
  default: "",
},

consultationFee: {
  type: String,
  default: "",
},

address: {
  type: String,
  default: "",
},

city: {
  type: String,
  default: "",
},

state: {
  type: String,
  default: "",
},

pincode: {
  type: String,
  default: "",
},

about: {
  type: String,
  default: "",
},

languages: {
  type: String,
  default: "",
},

licenseImage: {
  type: String,
  default: "",
},

degreeCertificate: {
  type: String,
  default: "",
},
availableDays: [String],

startTime: String,

endTime: String,

slotDuration: {
  type: Number,
  default: 30,
},
registerOtp: String,
registerOtpExpire: Date,
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