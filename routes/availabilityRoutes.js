const express =
  require("express");

const router =
  express.Router();

const {
  saveAvailability,
  getAvailability,
} = require(
  "../controllers/availabilityController"
);

router.post(
  "/save",
  saveAvailability
);

router.get(
  "/:id",
  getAvailability
);

module.exports =
  router;