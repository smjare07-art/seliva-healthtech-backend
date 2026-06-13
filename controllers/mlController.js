const HealthData =
require("../models/HealthData");

const {
  PythonShell
} = require("python-shell");

const path =
require("path");

exports.predictDisease =
async(req,res)=>{

try{

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
args:[
conductivity,
oxygen,
methane,
ammonia
]
}

);

const disease =
result[0];

const report =
await HealthData.create({

patientId,

conductivity,

oxygen,

methane,

ammonia,

prediction:
disease

});

res.json(report);

}catch(error){

res.status(500).json({
message:error.message
});

}

};