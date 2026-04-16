import Predictor from "./pages/Predictor";

function App() {
  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f4f6f8",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#2c3e50",
        }}
      >
         Heart Risk Analysis Dashboard
      </h1>

      <Predictor />
    </div>
  );
}

export default App;
