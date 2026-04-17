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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div style={cardStyle}>
      <h2>Enter Patient Clinical Details</h2>

      {/* 🔢 Number Inputs */}
      <Input label="Age (years)" name="age" onChange={handleChange} />
      <Input
        label="Resting Blood Pressure (mm Hg)"
        name="trestbps"
        onChange={handleChange}
      />
      <Input label="Cholesterol (mg/dL)" name="chol" onChange={handleChange} />
      <Input
        label="Maximum Heart Rate"
        name="thalach"
        onChange={handleChange}
      />
      <Input
        label="ST Depression (Oldpeak)"
        name="oldpeak"
        onChange={handleChange}
      />
      <Input
        label="Number of Major Vessels (0–3)"
        name="ca"
        onChange={handleChange}
      />

      {/* 🔽 Dropdowns */}
      <Select
        label="Sex"
        name="sex"
        options={{ 1: "Male", 0: "Female" }}
        onChange={handleChange}
      />

      <Select
        label="Chest Pain Type"
        name="cp"
        options={{
          0: "Asymptomatic",
          1: "Atypical angina",
          2: "Non-anginal",
          3: "Typical angina",
        }}
        onChange={handleChange}
      />

      <Select
        label="Resting ECG"
        name="restecg"
        options={{
          0: "Left ventricular hypertrophy",
          1: "Normal",
          2: "ST-T abnormality",
        }}
        onChange={handleChange}
      />

      <Select
        label="Slope"
        name="slope"
        options={{
          0: "Downsloping",
          1: "Flat",
          2: "Upsloping",
        }}
        onChange={handleChange}
      />

      <Select
        label="Thal"
        name="thal"
        options={{
          1: "Fixed defect",
          2: "Normal",
          3: "Reversible defect",
        }}
        onChange={handleChange}
      />

      {/* ✅ Toggles */}
      <Checkbox
        label="Fasting Blood Sugar > 120 mg/dL"
        name="fbs"
        onChange={handleChange}
      />

      <Checkbox
        label="Exercise Induced Angina"
        name="exang"
        onChange={handleChange}
      />

      {/* 🔘 Button */}
      <button style={buttonStyle} onClick={() => {
  const processed = {
    ...form,
    age: parseFloat(form.age),
    trestbps: parseFloat(form.trestbps),
    chol: parseFloat(form.chol),
    thalch: parseFloat(form.thalach),  // rename here
    oldpeak: parseFloat(form.oldpeak),
    ca: parseFloat(form.ca),
    sex: form.sex === "1" ? "Male" : "Female",
    cp: ({ "0": "Asymptomatic", "1": "Atypical angina", "2": "Non-anginal", "3": "Typical angina" })[form.cp],
    restecg: ({ "0": "Left ventricular hypertrophy", "1": "Normal", "2": "ST-T abnormality" })[form.restecg],
    slope: ({ "0": "Downsloping", "1": "Flat", "2": "Upsloping" })[form.slope],
    thal: ({ "1": "Fixed defect", "2": "Normal", "3": "Reversable defect" })[form.thal],
  };
  onSubmit(processed);
}}>
  Analyze Patient
</button>
    </div>
  );
}

/* 🔹 Reusable Components */

const Input = ({ label, name, onChange }) => (
  <div style={fieldStyle}>
    <label>{label}</label>
    <input type="number" name={name} onChange={onChange} style={inputStyle} />
  </div>
);

const Select = ({ label, name, options, onChange }) => (
  <div style={fieldStyle}>
    <label>{label}</label>
    <select name={name} onChange={onChange} style={inputStyle}>
      {Object.entries(options).map(([val, text]) => (
        <option key={val} value={val}>
          {text}
        </option>
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

const fieldStyle = {
  marginBottom: "10px",
};

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