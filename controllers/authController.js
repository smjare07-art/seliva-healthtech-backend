const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cloudinary =require("../config/cloudinary");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

   res.json({
  id: user._id,
  token,
  role: user.role,
  name: user.name,
  email: user.email,
  profileImage: user.profileImage,
  profileCompleted:
    user.profileCompleted,
});
  } catch (error) {
    res.status(500).json(error);
  }
};



exports.createAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({
      email: "admin@seliva.com",
    });

    if (adminExists) {
      return res.json({
        message: "Admin Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      "admin123",
      10
    );

    const admin = await User.create({
      name: "Seliva Admin",
      email: "admin@seliva.com",
      mobile: "9999999999",
      password: hashedPassword,
      role: "admin",
    });

    res.json(admin);
  } catch (error) {
    res.status(500).json(error);
  }
};


exports.addDoctor = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const exists = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (exists) {
      return res.status(400).json({
        message: "Doctor already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const doctor = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "doctor",
    });

    res.status(201).json({
      message: "Doctor Added Successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("OTP Request For:", email);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    console.log("Generated OTP:", otp);

   const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
});
    await transporter.verify();

    console.log("SMTP Connected");

    console.log("Sending OTP to:", email);

   /* await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Seliva HealthTech OTP",
      html: `
        <h2>Seliva HealthTech</h2>
        <p>Your OTP for password reset is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });*/

    console.log("OTP Email Sent Successfully");

    res.status(200).json({
  message: "OTP Sent Successfully",
  otp,
});
  } catch (error) {
    console.log("OTP ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
  });

  if (
    !user ||
    user.otp !== otp ||
    user.otpExpire < Date.now()
  ) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  res.json({
    message: "OTP Verified",
  });
};


exports.resetPassword = async (
  req,
  res
) => {
  const {
    email,
    otp,
    newPassword,
  } = req.body;

  const user = await User.findOne({
    email,
  });

  if (
    !user ||
    user.otp !== otp ||
    user.otpExpire < Date.now()
  ) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  user.password = await bcrypt.hash(
    newPassword,
    10
  );

  user.otp = null;
  user.otpExpire = null;

  await user.save();

  res.json({
    message:
      "Password Updated Successfully",
  });
};
exports.getDoctorCount = async (req, res) => {
  try {
    const count = await User.countDocuments({
      role: "doctor",
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getDoctors = async (
  req,
  res
) => {
  try {
    const doctors = await User.find({
      role: "doctor",
    }).select("-password");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.deleteDoctor = async (
  req,
  res
) => {
  try {
    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Doctor Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.updateDoctor = async (
  req,
  res
) => {
  try {
    const doctor =
      await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(doctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getDoctorById = async (
  req,
  res
) => {
  try {
    const doctor =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
    } = req.body;

    const userExists =
      await User.findOne({
        $or: [{ email }, { mobile }],
      });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "patient",
      profileCompleted: false,
    });

    res.status(201).json({
      message:
        "Patient Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.completeProfile = async (
  req,
  res
) => {
  try {
        console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    let imageUrl = "";

    if (req.file) {

  const fileBase64 =
    `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

  const result =
    await cloudinary.uploader.upload(
      fileBase64,
      {
        folder: "seliva/profile",
      }
    );

  imageUrl = result.secure_url;
}

    const user =
      await User.findByIdAndUpdate(
        req.body.userId,
        {
          ...req.body,

          profileImage:
            imageUrl,

          profileCompleted:
            true,
        },
        {
          new: true,
        }
      );

    res.json({
      message:
        "Profile Completed Successfully",

      user,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
exports.getPatientById = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};