const express = require("express");
const router = express.Router();

const { PythonShell } =
require("python-shell");

const path = require("path");

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

module.exports = router;