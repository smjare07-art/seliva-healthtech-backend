const DoctorAvailability =
require(
  "../models/DoctorAvailability"
);

exports.saveAvailability =
async (req, res) => {

  try {

    const {
      doctorId,
      availability,
    } = req.body;

    const data =
      await DoctorAvailability.findOneAndUpdate(

        {
          doctorId,
        },

        {
          availability,
        },

        {
          new: true,
          upsert: true,
        }
      );

    res.json({
      message:
        "Availability Saved",
      data,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};
exports.getAvailability =
async (req, res) => {

  try {

    const data =
      await DoctorAvailability.findOne({
        doctorId:
          req.params.id,
      });

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }
};