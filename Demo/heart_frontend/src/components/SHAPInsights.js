const labels = {
  trestbps: "Blood Pressure",
  oldpeak: "ST Depression",
  thalch: "Maximum Heart Rate",
  chol: "Cholestrol",
  ca: "Number of Major Vessels"
};

function SHAPInsights({ features }) {
  return (
    <div style={box}>
      <h3>Key Risk Factors</h3>

      {features.map((f, i) => (
        <p key={i}>
          <strong>{labels[f.feature] || f.feature}</strong> is contributing significantly (score: {f.value})
        </p>
      ))}
    </div>
  );
}

const box = {
  background: "white",
  padding: "15px",
  marginTop: "20px",
  borderRadius: "10px"
};

export default SHAPInsights;