const router = require("express").Router();
const Enroll = require("../model/Enroll");
const Course = require("../model/Course");
const Wait = require("../model/Wait");
const Quiz = require("../model/Quiz");
const User = require("../model/User");
const verify = require("./verifyToken");

router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.send(courses);
});

router.get("/ranking/:id", async (req, res) => {
  const target = await Enroll.find({ course_id: req.params.id }).sort({
    score: "desc",
  });

  const mapUser = await Promise.all(
    target.map(async (x) => {
      const userDetail = await User.findById(x.user_id);
      return {
        // user: {
        //   _id: userDetail._id,
        //   name: userDetail.name,
        //   email: userDetail.email,
        // },
        user_id: userDetail._id,
        user: userDetail.name,
        email: userDetail.email,
        score: x.score,
      };
    })
  );
  return res.send(mapUser);
});

router.get("/student/:id", async (req, res) => {
  const courseList = await Enroll.find({
    user_id: req.params.id,
  });
  res.status(200).send(courseList);
});

router.patch("/student/:id/quiz/:quizid", async (req, res) => {
  if (typeof req.params.id === "undefined") return res.status(400);
  const target = await Enroll.findOne({
    user_id: req.params.id,
  });

  const quizData = await Quiz.findById(req.params.quizid);

  await Enroll.findByIdAndUpdate(
    {
      _id: target._id,
    },
    { score: target.score + quizData.score }
  );

  const upadateTarget = await Enroll.findOne({
    user_id: req.params.id,
  });
  res.status(200).send(upadateTarget);
});

router.get("/user/waitlist/:id", async (req, res) => {
  const waitList = await Wait.find({ user_id: req.params.id });
  return res.status(200).send(waitList);
});

router.get("/class/:course", async (req, res) => {
  const classDetail = await Course.findOne({ course: req.params.course });
  if (!classDetail) return res.status(404);
  const authorName = await User.findById(classDetail.author_id);
  const studentList = await Enroll.find({
    course_id: classDetail._id,
  });
  const myObject = {
    classDetail,
    authorName,
    studentList,
  };
  return res.status(200).send(myObject);
});

router.get("/class/waitlist/:course", async (req, res) => {
  if (typeof req.params.course === "undefined")
    return res.status(400).send("erorr id null");
  const target = await Wait.find({
    course_id: req.params.course,
  });

  const waitList = await Promise.all(
    target.map(async (wait) => {
      try {
        const userDetail = await User.findById(wait.user_id);
        return {
          _id: wait._id,
          email: userDetail.email,
          name: userDetail.name,
        };
      } catch (err) {
        return res.status(500).send(err);
      }
    })
  );
  return res.status(200).send(waitList);
});

router.post("/waitListAccept", verify, async (req, res) => {
  const target = await Wait.findById(req.body._id);
  const enrolled = new Enroll({
    user_id: target.user_id,
    course_id: target.course_id,
  });
  try {
    await enrolled.save();
    await Wait.findByIdAndDelete(req.body._id);
    res.status(200).send(enrolled);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/enrollCourse", verify, async (req, res) => {
  const targetCourse = await Course.findById(req.body.course_id);
  if (targetCourse.author_id === req.user._id) {
    const haveEnrolled = await Enroll.findOne({
      user_id: req.body.user_id,
      course_id: req.body.course_id,
    });
    if (haveEnrolled) res.status(400).send("ALREADY IN COURSE");
    else {
      const enrolled = new Enroll({
        user_id: req.body.user_id,
        course_id: req.body.course_id,
      });
      try {
        await enrolled.save();
        res.status(200).send(enrolled);
      } catch (err) {
        res.status(400).send(err);
      }
    }
  } else {
    const haveWaitList = await Wait.findOne({
      user_id: req.body.user_id,
      course_id: req.body.course_id,
    });
    if (haveWaitList) res.status(400).send("ALREADY ENROLL");
    else {
      const waitlist = new Wait({
        user_id: req.body.user_id,
        course_id: req.body.course_id,
      });
      try {
        await waitlist.save();
        res.status(200).send(waitlist);
      } catch (err) {
        res.status(400).send(err);
      }
    }
  }
});

router.patch("/:class/update/:id/:score", async (req, res) => {
  const target = await Enroll.findOne({
    course_id: req.params.class,
    user_id: req.params.id,
  });

  await Enroll.findByIdAndUpdate(target.id, {
    score: parseInt(target.score) + parseInt(req.params.score),
  });
  return res.send(afterUpdate);
});

router.post("/unenroll", verify, async (req, res) => {
  const unroll = await Enroll.findOneAndDelete({
    user_id: req.body.user_id,
    course_id: req.body.course_id,
  });
  if (unroll === null) res.status(400).send("Something went wrong!");
  else res.status(200).send(unroll);
});

module.exports = router;
