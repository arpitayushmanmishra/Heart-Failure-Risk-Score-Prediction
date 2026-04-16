import express from "express";
import cors from "cors";
import hrsRoute from "./hrs.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/hrs", hrsRoute);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));