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
    const res = await axios.post("http://localhost:5000/api/hrs", data);
    console.log(res.data);
    setResult({
      risk_score: res.data.hrs_score,
      risk_level: res.data.risk,
      top_features: res.data.top_features,
      counterfactuals: []
    });
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};

  return (
    <div>
      <InputForm onSubmit={analyzePatient} />

      {result && (
        <>
          <ResultCard data={result} />
          <SHAPInsights features={result.top_features} />
          <Counterfactuals data={result.counterfactuals} />
        </>
      )}
    </div>
  );
}

export default Predictor;
