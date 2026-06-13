const express = require("express");
const router = express.Router();

const { PythonShell } =
require("python-shell");

const path =
require("path");

const {
  predictDisease,
  getPatientPredictions,
} = require(
  "../controllers/mlController"
);

// Python Test
router.get(
  "/python-test",
  async (req,res)=>{

    try{

      const result =
      await PythonShell.run(
        path.join(
          __dirname,
          "../python/test.py"
        )
      );

      res.json({
        result
      });

    }catch(error){

      res.status(500).json({
        message:error.message
      });

    }

  }
);

// ML Predict Test
router.get(
  "/predict-test",
  async (req,res)=>{

    try{

      const result =
      await PythonShell.run(
        path.join(
          __dirname,
          "../python/predict.py"
        ),
        {
          args:[
            78,
            22,
            15,
            5
          ]
        }
      );

      res.json({
        result
      });

    }catch(error){

      res.status(500).json({
        message:error.message
      });

    }

  }
);

// Save Prediction + Disease
router.post(
  "/predict",
  predictDisease
);

// Prediction History
router.get(
  "/history/:patientId",
  getPatientPredictions
);

module.exports =
router;