const router = require("express").Router();
const Quiz = require("../model/Quiz");
const Course = require("../model/Course");
const verify = require("./verifyToken");

router.post("/:id/add", verify, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).send("You not Allow here");
  const targetCourse = await Course.findOne({ _id: req.params.id });
  if (targetCourse.author_id !== req.user._id)
    return res.status(400).send("SOME THING WENT WRONG");

  const quiz = new Quiz({
    question: req.body.question,
    choice: req.body.choice,
    score: req.body.score,
    answer: req.body.answer,
    course_id: req.params.id,
  });

  try {
    await quiz.save();
    res.status(200).send({ QuestionID: quiz._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/:id/remove/:questionid", verify, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).send("You not Allow here");
  const targetCourse = await Course.findOne({ _id: req.params.id });
  if (targetCourse.author_id !== req.user._id)
    return res.status(400).send("SOME THING WENT WRONG");

  await Quiz.findByIdAndRemove(req.params.questionid);
  return res.status(200).send("REMOVE SUCCESS");
});

router.get("/:id", verify, async (req, res) => {
  const AllQuiz = await Quiz.find({ course_id: req.params.id });
  const fillter = AllQuiz.map(function (quiz) {
    return {
      _id: quiz._id,
      question: quiz.question,
      score: quiz.score,
      choice: quiz.choice,
    };
  });
  res.send(fillter);
});

router.get("/takequiz/:id", async (req, res) => {
  const target = await Quiz.findById(req.params.id);
  res.send(target);
});

module.exports = router;
