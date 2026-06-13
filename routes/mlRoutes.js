const express = require("express");
const router = express.Router();

const { PythonShell } = require("python-shell");
const path = require("path");

router.get(
  "/predict-test",
  async (req, res) => {
    try {

      const result =
        await PythonShell.run(
          path.join(
            __dirname,
            "../python/predict.py"
          ),
          {
            args: [
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

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  }
);

module.exports = router;