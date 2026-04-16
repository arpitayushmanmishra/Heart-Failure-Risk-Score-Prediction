const labels = {
  bp: "Blood Pressure",
  oldpeak: "ST Depression",
  thalach: "Heart Rate",
};

function Counterfactuals({ data }) {
  return (
    <div style={box}>
      <h3>Recommended Changes</h3>

      {data.map((c, i) => (
        <p key={i}>
          Reduce <b>{labels[c.feature]}</b> from {c.from} → {c.to}
        </p>
      ))}
    </div>
  );
}

const box = {
  background: "white",
  padding: "15px",
  marginTop: "20px",
  borderRadius: "10px",
};

export default Counterfactuals;
