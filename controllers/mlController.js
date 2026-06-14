const Prediction =
require("../models/Prediction");

const { PythonShell } =
require("python-shell");

const path =
require("path");

exports.predictDisease =
async (req, res) => {

  try {

    const {
      patientId,
      conductivity,
      oxygen,
      methane,
      ammonia
    } = req.body;

    const result =
      await PythonShell.run(
        path.join(
          __dirname,
          "../python/predict.py"
        ),
        {
          args: [
            conductivity,
            oxygen,
            methane,
            ammonia
          ]
        }
      );

    const disease =
      result[0];

    // Health Score
    const healthScore =
      Math.round(
        (
          Number(conductivity) +
          Number(oxygen) +
          (100 - Number(methane)) +
          (100 - Number(ammonia))
        ) / 4
      );

    // Health Status
    let healthStatus =
      "Good";

    if (healthScore < 70) {
      healthStatus =
        "Bad";
    }

    if (healthScore < 50) {
      healthStatus =
        "Critical";
    }

    // Disease Description
    let description =
      "No major health issue detected.";

    if (
      disease ===
      "Respiratory Disorder"
    ) {
      description =
        "Breathing related problem detected. Consult a pulmonologist.";
    }

    if (
      disease ===
      "Heart Disease"
    ) {
      description =
        "Possible heart related issue detected. Consult a cardiologist.";
    }

    const prediction =
      await Prediction.create({

        patientId,

        conductivity,
        oxygen,
        methane,
        ammonia,

        disease,

        healthScore,
        healthStatus,
        description

      });

    res.json({

      message:
        "Prediction Success",

      prediction

    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.getPatientPredictions =
async (req, res) => {

  try {

    const predictions =
      await Prediction.find({

        patientId:
          req.params.patientId

      }).sort({
        createdAt: -1
      });

    res.json(
      predictions
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};
exports.getPatientPredictions =
async (req, res) => {

  try {

    const predictions =
      await Prediction.find({
        patientId:
          req.params.patientId
      }).sort({
        createdAt: -1
      });

    res.json({
      totalTests:
        predictions.length,
      predictions
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};
const Prediction =
require("../models/Prediction");

exports.getAllReports =
async (req,res)=>{

try{

const reports =
await Prediction.find()
.populate(
"patientId",
"name profileImage gender city"
)
.sort({
createdAt:-1
});

res.json(reports);

}catch(error){

res.status(500).json({
message:error.message
});

}

};