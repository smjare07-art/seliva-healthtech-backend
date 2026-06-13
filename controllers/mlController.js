const Prediction =
require("../models/Prediction");

const { PythonShell } =
require("python-shell");

const path =
require("path");

exports.predictDisease =
async (req,res)=>{

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

const prediction =
await Prediction.create({

patientId,

conductivity,
oxygen,
methane,
ammonia,

disease

});

res.json({

message:
"Prediction Success",

prediction

});

}catch(error){

res.status(500).json({
message:error.message
});

}

};
exports.getPatientPredictions =
async (req,res)=>{

try{

const predictions =
await Prediction.find({

patientId:
req.params.patientId

})
.sort({
createdAt:-1
});

res.json(
predictions
);

}catch(error){

res.status(500).json({
message:error.message
});

}

};