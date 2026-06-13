const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cloudinary =require("../config/cloudinary");
const Prediction =require("../models/Prediction");
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

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
const {
name,
email,
mobile,
password,
} = req.body;


const exists = await User.findOne({
  $or: [
    { email },
    { mobile },
  ],
});

if (exists) {
  return res.status(400).json({
    message: "Doctor already exists",
  });
}

const hashedPassword =
  await bcrypt.hash(password, 10);

const doctor =
  await User.create({
    name,
    email,
    mobile,
    password: hashedPassword,
    role: "doctor",
    profileCompleted: false,
  });

await transporter.sendMail({
  from:
    '"SalivaHealth" <salivahealth@gmail.com>',
  to: email,
  subject:
    "Welcome to SalivaHealth",
  html:`
  <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:30px;">
    <div style="max-width:650px;margin:auto;background:#fff;border-radius:15px;overflow:hidden;">

      <div style="background:#4F46E5;padding:25px;text-align:center;">
        <h1 style="color:white;margin:0;">
          SalivaHealth
        </h1>
      </div>

      <div style="padding:30px;">
        <h2>
          Welcome Dr. ${name}
        </h2>

        <p>
          Your doctor account has been successfully created on
          <strong>SalivaHealth</strong>.
        </p>

        <p>
          Please download the SalivaHealth mobile application and login using the credentials below.
        </p>

        <div style="background:#EEF2FF;padding:15px;border-radius:10px;">
          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Password:</strong>
            ${password}
          </p>
        </div>

        <h3>
          Next Steps
        </h3>

        <ul>
          <li>Login to the app</li>
          <li>Complete your profile</li>
          <li>Upload profile photo</li>
          <li>Upload medical license</li>
          <li>Upload degree certificate</li>
          <li>Set your availability</li>
        </ul>

        <div style="text-align:center;margin-top:30px;">
          <a
            href="YOUR_PLAYSTORE_LINK"
            style="
              background:#4F46E5;
              color:white;
              text-decoration:none;
              padding:12px 24px;
              border-radius:8px;
              display:inline-block;
            "
          >
            Download App
          </a>
        </div>

        <p style="margin-top:30px;">
          Thank you for joining SalivaHealth.
        </p>

        <p>
          Regards,<br/>
          SalivaHealth Team
        </p>
      </div>

    </div>
  </div>
  `,
});

res.status(201).json({
  message:
    "Doctor Added Successfully",
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await User.findByIdAndUpdate(
      user._id,
      {
        otp,
        otpExpire: Date.now() + 10 * 60 * 1000,
      }
    );
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 60000,
});
await transporter.verify();
console.log("SMTP Connected Successfully");

   await transporter.sendMail({
  from: "salivahealth@gmail.com",
  to: email,
  subject: "Seliva HealthTech OTP",
  html: `
    <h2>Seliva HealthTech</h2>
    <p>Your OTP for password reset is:</p>
    <h1>${otp}</h1>
    <p>This OTP is valid for 10 minutes.</p>
  `,
});
    res.status(200).json({
      message: "OTP Sent Successfully",
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

    let profileUrl =
      req.body.profileImage;

    let licenseUrl =
      req.body.licenseImage;

    let degreeUrl =
      req.body.degreeCertificate;

    // Profile Image

    if (
      req.files?.profileImage
    ) {

      const fileBase64 =
        `data:${req.files.profileImage[0].mimetype};base64,${req.files.profileImage[0].buffer.toString("base64")}`;

      const result =
        await cloudinary.uploader.upload(
          fileBase64,
          {
            folder:
              "seliva/profile",
          }
        );

      profileUrl =
        result.secure_url;
    }

    // License Image

    if (
      req.files?.licenseImage
    ) {

      const fileBase64 =
        `data:${req.files.licenseImage[0].mimetype};base64,${req.files.licenseImage[0].buffer.toString("base64")}`;

      const result =
        await cloudinary.uploader.upload(
          fileBase64,
          {
            folder:
              "seliva/license",
          }
        );

      licenseUrl =
        result.secure_url;
    }

    // Degree Certificate

    if (
      req.files?.degreeCertificate
    ) {

      const fileBase64 =
        `data:${req.files.degreeCertificate[0].mimetype};base64,${req.files.degreeCertificate[0].buffer.toString("base64")}`;

      const result =
        await cloudinary.uploader.upload(
          fileBase64,
          {
            folder:
              "seliva/degree",
          }
        );

      degreeUrl =
        result.secure_url;
    }

    const doctor =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,

          profileImage:
            profileUrl,

          licenseImage:
            licenseUrl,

          degreeCertificate:
            degreeUrl,
        },
        {
          new: true,
        }
      );

    res.json({
      message:
        "Doctor Updated Successfully",

      doctor,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
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
  await User.findOne({ email });

if (userExists) {
  return res.status(400).json({
    message: "User already exists",
  });
}

const hashedPassword =
  await bcrypt.hash(password, 10);

const user =
  await User.create({
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
  user,
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
          profileImage: imageUrl,
          profileCompleted: true,
        },
        {
          new: true,
        }
      );

    console.log(
      "UPDATED USER =>",
      user
    );

    return res.status(200).json({
      success: true,
      message:
        "Profile Completed Successfully",
      user,
    });

  } catch (error) {

    console.log(
      "COMPLETE PROFILE ERROR =>",
      error
    );

    console.log(
      "ERROR MESSAGE =>",
      error.message
    );

    return res.status(500).json({
      success: false,
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
exports.getUserProfile = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
exports.updateProfile = async (
  req,
  res
) => {
  try {

    let imageUrl =
      req.body.profileImage;

    if (req.file) {

      const fileBase64 =
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result =
        await cloudinary.uploader.upload(
          fileBase64,
          {
            folder:
              "seliva/profile",
          }
        );

      imageUrl =
        result.secure_url;
    }

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          profileImage:
            imageUrl,
        },
        {
          new: true,
        }
      ).select("-password");

    res.json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
exports.completeDoctorProfile =
  async (req, res) => {
    try {
      console.log("BODY:", req.body);
console.log("FILES:", req.files);
     let profileUrl = "";
let licenseUrl = "";
let degreeUrl = "";
console.log("PROFILE IMAGE:");
console.log(req.files?.profileImage);

console.log("LICENSE IMAGE:");
console.log(req.files?.licenseImage);

console.log("DEGREE IMAGE:");
console.log(req.files?.degreeCertificate);
        if (
  req.files?.profileImage
) {

  const fileBase64 =
    `data:${req.files.profileImage[0].mimetype};base64,${req.files.profileImage[0].buffer.toString("base64")}`;

  const result =
    await cloudinary.uploader.upload(
      fileBase64,
      {
        folder:
          "seliva/profile",
      }
    );

  profileUrl =
    result.secure_url;
}
      if (
        req.files?.licenseImage
      ) {

        const fileBase64 =
          `data:${req.files.licenseImage[0].mimetype};base64,${req.files.licenseImage[0].buffer.toString("base64")}`;

        const result =
          await cloudinary.uploader.upload(
            fileBase64,
            {
              folder:
                "seliva/license",
            }
          );

        licenseUrl =
          result.secure_url;
      }

      if (
        req.files?.degreeCertificate
      ) {

        const fileBase64 =
          `data:${req.files.degreeCertificate[0].mimetype};base64,${req.files.degreeCertificate[0].buffer.toString("base64")}`;

        const result =
          await cloudinary.uploader.upload(
            fileBase64,
            {
              folder:
                "seliva/degree",
            }
          );

        degreeUrl =
          result.secure_url;
      }
        
      const doctor =
        await User.findByIdAndUpdate(
          req.body.userId,
          {
            ...req.body,
                  profileImage:
        profileUrl,

            licenseImage:
              licenseUrl,

            degreeCertificate:
              degreeUrl,

            profileCompleted:
              true,
          },
          {
            new: true,
          }
        );

      res.json({
        message:
          "Doctor Profile Completed",

        doctor,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };
  exports.updateAvailability =
async (req, res) => {

  try {

    const doctor =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          availableDays:
            req.body.availableDays,

          startTime:
            req.body.startTime,

          endTime:
            req.body.endTime,

          slotDuration:
            req.body.slotDuration,
        },
        {
          new: true,
        }
      );

    res.json({
      message:
        "Availability Updated",
      doctor,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};
exports.sendRegisterOTP = async (req, res) => {
try {


const { email } = req.body;

const existingUser =
  await User.findOne({ email });

if (
  existingUser &&
  existingUser.password &&
  existingUser.role === "patient" &&
  !existingUser.mobile?.startsWith("TEMP_")
) {
  return res.status(400).json({
    message: "User already registered",
  });
}

const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();

if (existingUser) {

  existingUser.registerOtp = otp;
  existingUser.registerOtpExpire =
    Date.now() + 10 * 60 * 1000;

  await existingUser.save();

} else {

  await User.create({
    email,
    mobile: `TEMP_${Date.now()}`,
    password: "temp",
    name: "Temp User",
    registerOtp: otp,
    registerOtpExpire:
      Date.now() + 10 * 60 * 1000,
  });

}

await transporter.sendMail({
  from: '"SalivaHealth" <salivahealth@gmail.com>',
  to: email,
  subject: "Email Verification OTP",
  html: `
    <h2>SalivaHealth</h2>
    <p>Your verification OTP:</p>
    <h1>${otp}</h1>
    <p>Valid for 10 minutes</p>
  `,
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

exports.verifyRegisterOTP = async (
req,
res
) => {
try {


const { email, otp } = req.body;

const user =
  await User.findOne({ email });

if (
  !user ||
  user.registerOtp !== otp ||
  user.registerOtpExpire < Date.now()
) {
  return res.status(400).json({
    message: "Invalid OTP",
  });
}

await User.deleteOne({
  email,
  mobile: {
    $regex: /^TEMP_/
  }
});

res.json({
  message:
    "Email Verified Successfully",
});


} catch (error) {


res.status(500).json({
  message: error.message,
});


}
};

exports.getPatientCount =
async (req,res)=>{

 try{

   const count =
     await User.countDocuments({
       role:"patient"
     });

   res.json({
     count
   });

 }catch(error){

   res.status(500).json({
     message:error.message
   });

 }

};
exports.getPatients =
async (req,res)=>{

  try{

    const patients =
      await User.find({
        role:"patient"
      });

    res.json(
      patients
    );

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};
exports.deletePatient =
async (req,res)=>{

  try{

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
      "Patient Deleted Successfully"
    });

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};
exports.getDoctorPatients =
async (req,res)=>{

  try{

    const appointments =
      await Appointment.find({
        doctorId:
          req.params.id
      })
      .populate(
        "patientId"
      );

    const uniquePatients =
      [...new Map(
        appointments.map(
          item=>[
            item.patientId._id.toString(),
            item.patientId
          ]
        )
      ).values()];

    res.json(
      uniquePatients
    );

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};


exports.getAllPatients =
async (req,res)=>{

try{

const patients =
await User.find({
role:"patient"
});

const data =
await Promise.all(

patients.map(
async(patient)=>{

const latestPrediction =
await Prediction
.findOne({
patientId:
patient._id
})
.sort({
createdAt:-1
});

return {

...patient.toObject(),

healthStatus:
latestPrediction
?.healthStatus ||
"Unknown",

lastDisease:
latestPrediction
?.disease ||
"No Data",

healthScore:
latestPrediction
?.healthScore ||
0,

};

})
);

res.json(data);

}catch(error){

res.status(500).json({
message:error.message
});

}

};