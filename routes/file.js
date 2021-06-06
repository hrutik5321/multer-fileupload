const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/user");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
    // cb(null, file.originalname);
  },
});

let upload = multer({
  storage,
  limits: { fieldSize: 1000000 * 100 },
}).single("myfile");

router.post("/us", (req, res) => {
  const user = new User(req.body);
  user.save((err, usr) => {
    return res.json(usr);
  });
});

router.post("/", (req, res) => {
  upload(req, res, async (err) => {
    if (!req.file) {
      return res.status(400).json({
        error: "All Fields Are Required!",
      });
    }

    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();

    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

module.exports = router;
