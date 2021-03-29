const router = require("express").Router();
const Course = require("../model/Course");
const Enroll = require("../model/Enroll");
const Quiz = require("../model/Quiz");
const Wait = require("../model/Wait");
const Message = require("../model/Message");
const User = require("../model/User");
const verify = require("./verifyToken");
const { addCouseValidation } = require("../validation");

router.get("/detail/:id", async (req, res) => {
  const courseDetail = await Course.findById(req.params.id);
  return res.status(200).send(courseDetail);
});

router.get("/message/course/:id", async (req, res) => {
  if (typeof req.params.id === "undefined")
    return res.status(500).send("null id");
  const target = await Message.find(
    { course_id: req.params.id },
    function (err, response) {
      if (err) return res.status(500).send("NULL");
    }
  );
  const matchTargetWithUser = await Promise.all(
    target.map(async (message) => {
      try {
        const userDetail = await User.findById(message.user_id);
        return {
          user: userDetail.name,
          text: message.message,
        };
      } catch (err) {
        return res.status(500).send("Something went wrong");
      }
    })
  );
  return res.send(matchTargetWithUser).status(200);
});

router.post("/message/course/:id", verify, async (req, res) => {
  const createMessage = new Message({
    course_id: req.params.id,
    user_id: req.user._id,
    message: req.body.message,
  });
  try {
    const savedMsg = await createMessage.save();
    res.send(savedMsg);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/remove/:id", verify, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).send("You not Allow here");
  const target = await Course.findOne({
    _id: req.params.id,
    author_id: req.user._id,
  });

  if (target === null) return res.status(400).send("SOME THING WENT WRONG");

  if (target.author_id === req.user._id) {
    try {
      await Enroll.deleteMany({ course_id: target._id });
      await Quiz.deleteMany({ course_id: target._id });
      await Wait.deleteMany({ course_id: target._id });
      await Message.deleteMany({ course_id: target._id });
      await Course.findByIdAndDelete(target._id);
      return res.status(200).send("REMOVE COURSE SUCESS");
    } catch (err) {
      return res.status(400).send("ERROR DELETE");
    }
  } else return res.status(400).send("SOME THING WENT WRONG");
});

router.post("/add", verify, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).send("You not Allow here");

  //Validate
  const { error } = addCouseValidation(req.body);
  if (error) return res.status(400).send(error);

  //Checking if the course ID is exist
  const courseIdExist = await Course.findOne({ course: req.body.course });
  if (courseIdExist) return res.status(400).send("Course ID already exists!");

  //Checking if the course name is exist
  const courseNameExist = await Course.findOne({ name: req.body.name });
  if (courseNameExist)
    return res.status(400).send("Course Name already exists!");

  // //Create new course
  const course = new Course({
    course: req.body.course,
    name: req.body.name,
    author_id: req.user._id,
  });
  try {
    const savedCourse = await course.save();
    res.send(savedCourse);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
