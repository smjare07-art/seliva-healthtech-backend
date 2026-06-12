const Availability =
  require(
    "../models/Availability"
  );

exports.saveAvailability =
  async (req, res) => {

    try {

      const {
        doctorId,
        availability,
      } = req.body;

      const data =
        await Availability.findOneAndUpdate(
          {
            doctorId,
          },

          {
            doctorId,
            availability,
          },

          {
            upsert: true,
            new: true,
          }
        );

      res.json({
        message:
          "Availability Saved Successfully",

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
        await Availability.findOne({
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