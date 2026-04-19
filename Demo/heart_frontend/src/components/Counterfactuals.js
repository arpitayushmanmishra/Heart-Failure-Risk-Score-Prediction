// const labels = {
//   trestbps: "Blood Pressure",
//   oldpeak: "ST Depression",
//   thalch: "Heart Rate",
//   chol: "Cholesterol",
//   ca: "Major Vessels",
// };

// function Counterfactuals({ data }) {
//   if (!data || data.length === 0) return null;

//   return (
//     <div style={box}>
//       <h3>Recommended Changes</h3>

//       {data.map((rec, i) => (
//         <div key={i} style={card}>
//           <h4>Recommendation {i + 1}</h4>

//           {rec.changes.length === 0 ? (
//             <p>No significant changes needed</p>
//           ) : (
//             rec.changes.map((c, j) => (
//               <p key={j}>
//                 {c.change === "increase" ? "Increase" : "Decrease"}{" "}
//                 <b>{labels[c.feature] || c.feature}</b> from {c.from} → {c.to}
//               </p>
//             ))
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// const box = {
//   background: "white",
//   padding: "15px",
//   marginTop: "20px",
//   borderRadius: "10px",
// };

// const card = {
//   marginBottom: "15px",
//   padding: "10px",
//   border: "1px solid #eee",
//   borderRadius: "8px",
//   background: "#fafafa",
// };

// export default Counterfactuals;
const labels = {
  trestbps: "Blood Pressure",
  oldpeak: "ST Depression",
  thalch: "Heart Rate",
  chol: "Cholesterol",
  ca: "Major Vessels",
};

function Counterfactuals({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div style={box}>
      <h3>Recommended Changes</h3>

      {data.map((rec, i) => (
        <div key={i} style={card}>
          <h4>
            {i === 0 ? "⭐ Best Recommendation" : `Recommendation ${i + 1}`}
          </h4>

          {/* 🔥 Show risk */}
          <p>
            Risk: {rec.original_risk} → {rec.new_risk} ({rec.risk_reduction}% ↓)
          </p>

          {/* 🔥 Show explanation */}
          <p style={{ color: "#555" }}>{rec.explanation}</p>

          {/* 🔥 Show changes */}
          {rec.changes.map((c, j) => (
            <p key={j}>
              {c.change === "increase" ? "Increase" : "Decrease"}{" "}
              <b>{labels[c.feature] || c.feature}</b> by {c.amount}
            </p>
          ))}
        </div>
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

const card = {
  marginBottom: "15px",
  padding: "12px",
  borderRadius: "10px",
  background: "#fafafa",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

export default Counterfactuals;