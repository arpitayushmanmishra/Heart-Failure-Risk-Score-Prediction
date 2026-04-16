import express from "express";
import config from "./hrs_config.json" assert { type: "json" };

const router = express.Router();

function oneHotEncode(input) {
  return {
    age: input.age,
    trestbps: input.trestbps,
    chol: input.chol,
    thalch: input.thalch,
    oldpeak: input.oldpeak,
    ca: input.ca,
    sex_Male: input.sex === "Male" ? 1 : 0,
    "cp_atypical angina": input.cp === "Atypical angina" ? 1 : 0,
    "cp_non-anginal": input.cp === "Non-anginal" ? 1 : 0,
    "cp_typical angina": input.cp === "Typical angina" ? 1 : 0,
    fbs_True: input.fbs ? 1 : 0,
    restecg_normal: input.restecg === "Normal" ? 1 : 0,
    "restecg_st-t abnormality": input.restecg === "ST-T abnormality" ? 1 : 0,
    exang_True: input.exang ? 1 : 0,
    slope_flat: input.slope === "Flat" ? 1 : 0,
    slope_upsloping: input.slope === "Upsloping" ? 1 : 0,
    thal_normal: input.thal === "Normal" ? 1 : 0,
    "thal_reversable defect": input.thal === "Reversable defect" ? 1 : 0,
  };
}

router.post("/", (req, res) => {
  const encoded = oneHotEncode(req.body);

  let score = 0;
  for (const feature of config.features) {
    const min = config.scaler_min[feature];
    const max = config.scaler_max[feature];
    const scaled = (encoded[feature] - min) / (max - min);
    score += scaled * config.hrs_weights[feature];
  }

  const risk =
    score < config.thresholds.low ? "Low" :
    score < config.thresholds.high ? "Moderate" : "High";

  res.json({ hrs_score: parseFloat(score.toFixed(4)), risk });
});

export default router;