import express from "express";
import cors from "cors";
import { calculateHRS } from "./hrs.js";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

// ==============================
// MAIN ANALYZE ROUTE
// ==============================
app.post("/analyze", async (req, res) => {
  try {
    const input = req.body;

    // ✅ Step 1: HRS (real logic)
    const hrsResult = calculateHRS(input);

    const { hrs_score, risk, contributions, top_features } = hrsResult;

    let counterfactuals = [];

    //Call Python ONLY if High risk
    if (risk === "High") {
      try {
        const response = await axios.post(
          "https://heart-failure-risk-score-prediction.onrender.com/counterfactual",
          {
            ...input,
            risk,
            top_features: top_features.map(f => f.feature)
          }
        );

        counterfactuals = response.data;

      } catch (err) {
        console.log("Python API error:", err.message);
      }
    }

    //Final response to frontend
    res.json({
      risk_score: hrs_score,
      risk_level: risk,
      contributions,
      top_features,
      counterfactuals,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// START SERVER
// ==============================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
