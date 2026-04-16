const labels = {
  oldpeak: "ST Depression",
  bp: "Blood Pressure",
  chol: "Cholesterol"
};

function SHAPInsights({ features }) {
  return (
    <div style={box}>
      <h3>Key Risk Factors</h3>

      {features.map((f, i) => (
        <p key={i}>
          {labels[f.feature] || f.feature} is contributing significantly
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