
import React, { useState } from "react";

function InputForm({ onSubmit }) {
  const [form, setForm] = useState({
    age: "",
    trestbps: "",
    chol: "",
    thalach: "",
    oldpeak: "",
    ca: "",
    sex: "1",
    cp: "0",
    restecg: "1",
    slope: "1",
    thal: "2",
    fbs: false,
    exang: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    // ✅ Required fields check
    const requiredFields = ["age","trestbps","chol","thalach","oldpeak","ca"];
    for (let field of requiredFields) {
      if (form[field] === "") {
        setError("Please fill all required fields");
        return;
      }
    }

    // ✅ Range validation
    if (form.age < 20 || form.age > 100) return setError("Age must be 20–100");
    if (form.trestbps < 80 || form.trestbps > 200) return setError("BP must be 80–200");
    if (form.chol < 100 || form.chol > 600) return setError("Cholesterol must be 100–600");
    if (form.thalach < 60 || form.thalach > 220) return setError("Heart rate must be 60–220");
    if (form.oldpeak < 0 || form.oldpeak > 6) return setError("Oldpeak must be 0–6");
    if (form.ca < 0 || form.ca > 3) return setError("CA must be 0–3");

    setError("");

    const processed = {
      age: parseFloat(form.age),
      trestbps: parseFloat(form.trestbps),
      chol: parseFloat(form.chol),
      thalach: parseFloat(form.thalach), // ✅ FIXED
      oldpeak: parseFloat(form.oldpeak),
      ca: parseInt(form.ca),
      sex: form.sex === "1" ? "Male" : "Female",
      cp: ({ "0": "Asymptomatic", "1": "Atypical angina", "2": "Non-anginal", "3": "Typical angina" })[form.cp],
      restecg: ({ "0": "Left ventricular hypertrophy", "1": "Normal", "2": "ST-T abnormality" })[form.restecg],
      slope: ({ "0": "Downsloping", "1": "Flat", "2": "Upsloping" })[form.slope],
      thal: ({ "1": "Fixed defect", "2": "Normal", "3": "Reversible defect" })[form.thal],
      fbs: form.fbs,
      exang: form.exang,
    };

    onSubmit(processed);
  };

  return (
    <div style={cardStyle}>
      <h2>Enter Patient Clinical Details</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🔢 Number Inputs */}
      <Input label="Age (years)" name="age" min="20" max="100" onChange={handleChange} />
      <Input label="Resting BP (mm Hg)" name="trestbps" min="80" max="200" onChange={handleChange} />
      <Input label="Cholesterol (mg/dL)" name="chol" min="100" max="600" onChange={handleChange} />
      <Input label="Max Heart Rate" name="thalach" min="60" max="220" onChange={handleChange} />
      <Input label="Oldpeak" name="oldpeak" min="0" max="6" step="0.1" onChange={handleChange} />
      <Input label="Major Vessels (0–3)" name="ca" min="0" max="3" step="1" onChange={handleChange} />

      {/* 🔽 Dropdowns */}
      <Select label="Sex" name="sex" options={{ 1: "Male", 0: "Female" }} onChange={handleChange} />

      <Select label="Chest Pain" name="cp" options={{
        0: "Asymptomatic",
        1: "Atypical angina",
        2: "Non-anginal",
        3: "Typical angina"
      }} onChange={handleChange} />

      <Select label="Rest ECG" name="restecg" options={{
        0: "LV Hypertrophy",
        1: "Normal",
        2: "ST-T abnormality"
      }} onChange={handleChange} />

      <Select label="Slope" name="slope" options={{
        0: "Downsloping",
        1: "Flat",
        2: "Upsloping"
      }} onChange={handleChange} />

      <Select label="Thal" name="thal" options={{
        1: "Fixed defect",
        2: "Normal",
        3: "Reversible defect"
      }} onChange={handleChange} />

      {/* ✅ Checkboxes */}
      <Checkbox label="Fasting Blood Sugar > 120" name="fbs" onChange={handleChange} />
      <Checkbox label="Exercise Induced Angina" name="exang" onChange={handleChange} />

      {/* 🔘 Button */}
      <button style={buttonStyle} onClick={handleSubmit}>
        Analyze Patient
      </button>
    </div>
  );
}

/* 🔹 Components */

const Input = ({ label, name, onChange, min, max, step }) => (
  <div style={fieldStyle}>
    <label>{label}</label>
    <input
      type="number"
      name={name}
      min={min}
      max={max}
      step={step || "any"}
      required
      onChange={onChange}
      onKeyDown={(e) => {
        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
      }}
      style={inputStyle}
    />
  </div>
);

const Select = ({ label, name, options, onChange }) => (
  <div style={fieldStyle}>
    <label>{label}</label>
    <select name={name} onChange={onChange} style={inputStyle}>
      {Object.entries(options).map(([val, text]) => (
        <option key={val} value={val}>{text}</option>
      ))}
    </select>
  </div>
);

const Checkbox = ({ label, name, onChange }) => (
  <div style={{ marginTop: "10px" }}>
    <label>
      <input type="checkbox" name={name} onChange={onChange} /> {label}
    </label>
  </div>
);

/* 🎨 Styles */

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  maxWidth: "500px",
  margin: "auto",
};

const fieldStyle = { marginBottom: "10px" };

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
};

const buttonStyle = {
  marginTop: "15px",
  padding: "12px",
  width: "100%",
  background: "#2ecc71",
  color: "white",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold",
};

export default InputForm;

