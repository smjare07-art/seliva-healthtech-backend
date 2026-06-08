exports.register = async (req, res) => {
  res.json({
    message: "Register API Working",
  });
};

const jwt = require("jsonwebtoken");

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
      token,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
const nodemailer = require("nodemailer");

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

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
    user.otpExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Seliva OTP",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });

    res.json({
      message: "OTP Sent Successfully",
    });
  } catch (error) {
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