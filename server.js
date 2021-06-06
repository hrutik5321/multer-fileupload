const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fileRoutes = require("./routes/file");
const showRoutes = require("./routes/show");
const path = require("path");
const File = require("./models/file");

dotenv.config();

mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("DB Connected");
  }
);

app.use(express.json());

//other server to use uplods folder
app.set("views", path.join(__dirname, "/views"));

app.set("view engine", "ejs");

app.use("/api/getfile", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Your Server Is Running",
  });
});

app.use("/api/file", fileRoutes);

app.use("/files", showRoutes);

app.get("/api/getfile", (req, res) => {
  File.find().exec((err, file) => {
    const filepath = file[0].filename;
    // console.log(filepath);
    // return res.send(filepath);
    res.send({
      msg: "Files here",
      file: file[2].filename,
    });
  });
});

const PORT = process.env.PORTS;
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log("Server Running At 8000");
});
