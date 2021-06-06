const router = require("express").Router();
const File = require("../models/file");

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { err: "Link has been expired" });
    }
    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    console.log(error);
    return res.render("download", { err: "Something Went Wrong" });
  }
});

// router.get("/api/getimage",  (req, res) => {
//   File.find().exec((err, file) => {
//     const filepath = file[0].filename;
//     // console.log(filepath);
//     // return res.send(filepath);
//     res.send({
//       msg: "Files here",
//       file: file[2].filename
//     });
//   })
// });

module.exports = router;
