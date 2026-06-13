const Appointment =
require("../models/Appointment");
const User =
require("../models/User");
const Notification =
require("../models/Notification");
exports.bookAppointment =
async (req,res)=>{

  try{

    const appointment =
      await Appointment.create(
        req.body
      );

    await Notification.create({

      userId:
        req.body.doctorId,

      title:
        "New Appointment Request",

      message:
        "A patient has requested an appointment.",

      type:
        "appointment",

      referenceId:
        appointment._id,

    });

    res.status(201).json(
      appointment
    );

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};
exports.getDoctorAppointments =
async (req, res) => {

  try {

    const appointments =
      await Appointment.find({
        doctorId:
          req.params.id,
      })
        
          .populate(
  "patientId"
)
     

    res.json(
      appointments
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};
exports.acceptAppointment =
async (req, res) => {

  try {

    const appointment =
      await Appointment.findByIdAndUpdate(
        req.params.id,
        {
          status: "Accepted",
        },
        {
          new: true,
        }
      );

    await Notification.create({

      userId:
        appointment.patientId,

      title:
        "Appointment Accepted",

      message:
        "Doctor accepted your appointment",

      appointmentId:
        appointment._id,

    });

    res.json(
      appointment
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};
exports.rejectAppointment =
async (req, res) => {

  try {

    const appointment =
      await Appointment.findByIdAndUpdate(
        req.params.id,
        {
          status: "Rejected",
        },
        {
          new: true,
        }
      );

    await Notification.create({

      userId:
        appointment.patientId,

      title:
        "Appointment Rejected",

      message:
        "Doctor rejected your appointment",

      appointmentId:
        appointment._id,

    });

    res.json(
      appointment
    );

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
exports.getPatientAppointments =
async (req, res) => {

  try {

    const appointments =
      await Appointment.find({
        patientId:
          req.params.id,
      })
      .populate(
        "doctorId",
        "name specialization"
      );

    res.json(
      appointments
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};
exports.getBookedSlots =
async (req, res) => {

  try {

    const {
      doctorId,
      date,
    } = req.params;

    const appointments =
      await Appointment.find({
        doctorId,
        appointmentDate:
          date,
      });

    const slots =
      appointments.map(
        (a) =>
          a.appointmentTime
      );

    res.json(slots);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};