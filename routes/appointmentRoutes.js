const express =
require("express");

const router =
express.Router();

const {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  acceptAppointment,
  rejectAppointment,
  getBookedSlots,
} = require(
  "../controllers/appointmentController"
);

router.post(
  "/book",
  bookAppointment
);

router.get(
  "/doctor/:id",
  getDoctorAppointments
);

router.get(
  "/patient/:id",
  getPatientAppointments
);

router.put(
  "/accept/:id",
  acceptAppointment
);

router.put(
  "/reject/:id",
  rejectAppointment
);
router.get(
  "/doctor/:doctorId/date/:date",
  getBookedSlots
);

module.exports =
router;