import sys
import joblib

model = joblib.load("python/disease_model.pkl")
encoder = joblib.load("python/label_encoder.pkl")

conductivity = float(sys.argv[1])
oxygen = float(sys.argv[2])
methane = float(sys.argv[3])
ammonia = float(sys.argv[4])

sample = [[
    conductivity,
    oxygen,
    methane,
    ammonia
]]

prediction = model.predict(sample)

disease = encoder.inverse_transform(prediction)

print(disease[0])