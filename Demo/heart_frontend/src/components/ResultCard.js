function ResultCard({ data }) {
  const color =
    data.risk_level === "High" ? "red" :
    data.risk_level === "Moderate" ? "orange" : "green";

  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      marginTop: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <h2>Risk Result</h2>

      <h1 style={{ color }}>{data.risk_level}</h1>

      <p><strong>HRS Score:</strong> {data.risk_score}</p>
    </div>
  );
}

export default ResultCard;