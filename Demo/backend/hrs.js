// import config from "./hrs_config.json" with { type: "json" };

// // ======================
// // ONE HOT ENCODE
// // ======================
// function oneHotEncode(input) {
//   return {
//     age: input.age,
//     trestbps: input.trestbps,
//     chol: input.chol,
//     thalch: input.thalch,
//     oldpeak: input.oldpeak,
//     ca: input.ca,
//     sex_Male: input.sex === "Male" ? 1 : 0,
//     "cp_atypical angina": input.cp === "Atypical angina" ? 1 : 0,
//     "cp_non-anginal": input.cp === "Non-anginal" ? 1 : 0,
//     "cp_typical angina": input.cp === "Typical angina" ? 1 : 0,
//     fbs_True: input.fbs ? 1 : 0,
//     restecg_normal: input.restecg === "Normal" ? 1 : 0,
//     "restecg_st-t abnormality": input.restecg === "ST-T abnormality" ? 1 : 0,
//     exang_True: input.exang ? 1 : 0,
//     slope_flat: input.slope === "Flat" ? 1 : 0,
//     slope_upsloping: input.slope === "Upsloping" ? 1 : 0,
//     thal_normal: input.thal === "Normal" ? 1 : 0,
//     "thal_reversable defect": input.thal === "Reversable defect" ? 1 : 0,
//   };
// }

// // ======================
// // MAIN FUNCTION (NEW)
// // ======================
// export function calculateHRS(input) {
//   const encoded = oneHotEncode(input);

//   const contributions = {};
//   let score = 0;

//   for (const feature of config.features) {
//     const min = config.scaler_min[feature];
//     const max = config.scaler_max[feature];

//     const scaled = (encoded[feature] - min) / (max - min);
//     const contribution = scaled * config.hrs_weights[feature];

//     contributions[feature] = parseFloat(contribution.toFixed(4));
//     score += contribution;
//   }

//   const risk =
//     score < config.thresholds.low ? "Low" :
//     score < config.thresholds.high ? "Moderate" : "High";

//   const actionableFeatures = ['trestbps', 'oldpeak', 'thalch', 'chol', 'ca'];

//   const topFeatures = Object.entries(contributions)
//     .filter(([feature]) => actionableFeatures.includes(feature))
//     .sort((a, b) => b[1] - a[1])
//     .map(([feature, value]) => ({ feature, value }));

//   return {
//     hrs_score: parseFloat(score.toFixed(4)),
//     risk,
//     contributions,
//     top_features: topFeatures
//   };
// }
import config from "./hrs_config.json" with { type: "json" };

// ======================
// ONE HOT ENCODE
// ======================
function oneHotEncode(input) {
  return {
    age: input.age,
    trestbps: input.trestbps,
    chol: input.chol,
    thalch: input.thalch ?? input.thalach, // keep as you said
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

// ======================
// MAIN FUNCTION
// ======================
export function calculateHRS(input) {
  const encoded = oneHotEncode(input);

  const contributions = {};
  let score = 0;

  console.log("======== DEBUG START ========");

  for (const feature of config.features) {
    const min = config.scaler_min[feature];
    const max = config.scaler_max[feature];
    const value = encoded[feature];

    // 🔍 DEBUG LOG
    console.log(
      "Feature:",
      feature,
      "| Value:",
      value,
      "| Min:",
      min,
      "| Max:",
      max,
    );

    // ❌ undefined check
    if (value === undefined) {
      console.log("❌ UNDEFINED VALUE for:", feature);
      contributions[feature] = 0;
      continue;
    }

    // ⚠️ scaling issue
    if (max === min || max === undefined || min === undefined) {
      console.log("⚠️ INVALID MIN/MAX for:", feature);
      contributions[feature] = 0;
      continue;
    }

    const scaled = (value - min) / (max - min);
    const contribution = scaled * config.hrs_weights[feature];

    contributions[feature] = parseFloat(contribution.toFixed(4));
    score += contribution;
  }

  console.log("👉 Final Score:", score);
  console.log("👉 Contributions:", contributions);
  console.log("======== DEBUG END ========");

  // ======================
  // RISK LEVEL
  // ======================
  const risk =
    score < config.thresholds.low
      ? "Low"
      : score < config.thresholds.high
        ? "Moderate"
        : "High";

  // ======================
  // TOP FEATURES
  // ======================
  const actionableFeatures = ["trestbps", "oldpeak", "thalch", "chol", "ca"];

  const topFeatures = Object.entries(contributions)
    .filter(
      ([feature, value]) => actionableFeatures.includes(feature) && value > 0,
    )
    .sort((a, b) => b[1] - a[1])
    .map(([feature, value]) => ({ feature, value }));

  return {
    hrs_score: parseFloat(score.toFixed(4)),
    risk,
    contributions,
    top_features: topFeatures,
  };
}