const express = require("express");
const app = express();
const cors = require("cors");
const products = require("./routes/products");
const http = require("http");
const path = require("path");

const server = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});

app.use("/", products);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});
app.use((err, req, res) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

module.export = app;
