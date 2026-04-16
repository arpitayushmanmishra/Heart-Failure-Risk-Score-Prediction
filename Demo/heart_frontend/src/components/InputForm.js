import React, { useState } from "react";

const fieldLabels = {
  age: "Age",
  bp: "Resting Blood Pressure (mm Hg)",
  chol: "Cholesterol (mg/dL)",
  oldpeak: "ST Depression (Oldpeak)",
  thalach: "Maximum Heart Rate",
};

function InputForm({ onSubmit }) {
  const [form, setForm] = useState({
    age: "",
    bp: "",
    chol: "",
    oldpeak: "",
    thalach: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={cardStyle}>
      <h2>Enter Patient Clinical Details</h2>

      {Object.keys(form).map((key) => (
        <div key={key} style={{ marginBottom: "10px" }}>
          <label>{fieldLabels[key]}</label>
          <br />
          <input
            name={key}
            type="number"
            placeholder={fieldLabels[key]}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
      ))}

      <button style={buttonStyle} onClick={() => onSubmit(form)}>
        Analyze Patient
      </button>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  maxWidth: "400px",
  margin: "auto",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
};

const buttonStyle = {
  marginTop: "15px",
  padding: "10px",
  width: "100%",
  background: "#3498db",
  color: "white",
  border: "none",
  borderRadius: "5px",
};

export default InputForm;
