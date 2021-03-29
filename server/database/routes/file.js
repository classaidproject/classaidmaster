const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const File = require("../model/File");
const User = require("../model/User");

cloudinary.config({
  cloud_name: "dkkurkdwa",
  api_key: "654696212685191",
  api_secret: "sduuYLmK_df0n0Mirb4J4CiWZDY",
});

var storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const target = await File.find();
  const mapTargetWithUser = await Promise.all(
    target.map(async (doc) => {
      const userDetail = await User.findById(doc.user_id);
      return {
        clound_path: doc.clound_path,
        description: doc.description,
        modify_date: doc.modify_date,
        public_id: doc.public_id,
        name: userDetail.name,
      };
    })
  );
  return res.send(mapTargetWithUser);
});

router.get("/:id", async (req, res) => {
  const target = await File.find({ course_id: req.params.id });
  const mapTargetWithUser = await Promise.all(
    target.map(async (doc) => {
      const userDetail = await User.findById(doc.user_id);
      return {
        clound_path: doc.clound_path,
        description: doc.description,
        modify_date: doc.modify_date,
        public_id: doc.public_id,
        name: userDetail.name,
      };
    })
  );
  return res.send(mapTargetWithUser);
});

function checkFile(mimetype) {
  if (typeof mimetype === "undefined") return false;
  const accecptedFile = ["pdf", "jpg", "jpeg", "png"];
  if (accecptedFile.includes(mimetype.split("/")[mimetype.split.length - 1]))
    return true;
  return false;
}

function checkPicture(mimetype) {
  console.log(mimetype.split("/")[mimetype.split.length - 1]);
  if (typeof mimetype === "undefined") return false;
  const accecptedFile = ["jpg", "jpeg", "png"];
  if (accecptedFile.includes(mimetype.split("/")[mimetype.split.length - 1]))
    return true;
  return false;
}

router.patch("/profile/:id", upload.single("file"), async (req, res, next) => {
  // console.log(req.file);
  try {
    if (typeof req.file !== "undefined") {
      if (!checkPicture(req.file.mimetype))
        return res.status(400).send("file extension not allow");
      cloudinary.uploader
        .upload(req.file.path)
        .then(async (result) => {
          const target = await User.findById(req.params.id);
          cloudinary.uploader.destroy(target.public_id);
          await User.findByIdAndUpdate(req.params.id, {
            picture_url: result.url,
            public_id: result.public_id,
          });
        })
        .catch((error) => {
          return res.status(500).send({
            message: "fail to upload profile picture",
            error,
          });
        });
    }
    if (req.body.name !== null) {
      await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
      });
      return res.status(200).send("Update successful");
    }
  } catch (err) {
    return res.status(500).send("Something went wrong");
  }
});

router.post("/:id/:user", upload.single("file"), (req, res, next) => {
  // console.log(req.file);
  if (checkFile(req.file.mimetype)) {
    cloudinary.uploader
      .upload(req.file.path)
      .then((result) => {
        // console.log(result);
        const fileUploaded = new File({
          clound_path: result.url,
          public_id: result.public_id,
          description: req.body.description,
          course_id: req.params.id,
          user_id: req.params.user,
        });
        fileUploaded.save();
        return res.status(200).send(fileUploaded);
      })
      .catch((error) => {
        res.status(500).send({
          message: "failure",
          error,
        });
      });
  } else
    return res.status(400).send("File extension allow is Pdf Jpg Jpeg or Png");
});

router.delete("/:id", async (req, res, next) => {
  const target = await File.findById(req.params.id);
  cloudinary.uploader.destroy(target.public_id, function (err, result) {
    // console.log(result, err);
  });
  res.send(target);
});

module.exports = router;
