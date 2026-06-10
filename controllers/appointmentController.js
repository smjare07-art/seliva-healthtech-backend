const Appointment =
require("../models/Appointment");

exports.bookAppointment =
async (req, res) => {

  try {

    const appointment =
      await Appointment.create(
        req.body
      );

    res.status(201).json(
      appointment
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
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
          "patientId",
          "name email mobile"
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
exports.acceptAppointment =
async (req, res) => {

  try {

    const appointment =
      await Appointment.findByIdAndUpdate(
        req.params.id,
        {
          status:
            "Accepted",
        },
        {
          new: true,
        }
      );

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
          status:
            "Rejected",
        },
        {
          new: true,
        }
      );

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