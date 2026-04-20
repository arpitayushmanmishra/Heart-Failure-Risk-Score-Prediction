import React, { useState } from "react";
import axios from "axios";
import InputForm from "../components/InputForm";
import ResultCard from "../components/ResultCard";
import SHAPInsights from "../components/SHAPInsights";
import Counterfactuals from "../components/Counterfactuals";

function Predictor() {
  const [result, setResult] = useState(null);

  const analyzePatient = async (data) => {
    try {
      // ✅ ONLY call Express
      const res = await axios.post("https://heart-failure-risk-score-prediction-1.onrender.com", data);

      const response = res.data;

      setResult({
        risk_score: response.risk_score,
        risk_level: response.risk_level,
        top_features: response.top_features,
        counterfactuals: response.counterfactuals?.counterfactuals || []
      });

    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div>
      <InputForm onSubmit={analyzePatient}/>

      {result && (
        <>
          <ResultCard data={result} />
          <SHAPInsights features={result.top_features} />

          {result.counterfactuals.length > 0 && (
            <Counterfactuals data={result.counterfactuals} />
          )}
        </>
      )}
    </div>
  );
}

export default Predictor;
