const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const verify = require("./verifyToken");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

router.get("/alluser", async (req, res) => {
  const allUser = await User.find();
  const fillter = allUser.map((user) => {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  });
  res.send(fillter);
});

router.get("/detail/:id", async (req, res) => {
  const userDetail = await User.findOne({ _id: req.params.id });
  res.send(userDetail);
});

router.patch("/", verify, async (req, res) => {
  const fillter = { _id: req.user._id };
  const update = { name: req.body.name };
  await User.findByIdAndUpdate(fillter, update);
  res.send(`UPDATE SUCCESS RENAME TO ${req.body.name}`);
});

router.post("/register", async (req, res) => {
  //Validate
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the user is exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists!");

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    is_admin: req.body.is_admin,
  });
  try {
    await user.save();
    res.status(200).send({ user: user.id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if the user is exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("EMAIL IS WRONG!");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("PASSWORD IS WRONG!");

  //Create and assign a token
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture_url,
      is_admin: user.is_admin,
    },
    process.env.TOKEN
  );
  res.header("auth-token", token).send(token);
});

router.post("/refreshLogin", verify, async (req, res) => {
  const user = await User.findById(req.user._id);
  try {
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture_url,
        is_admin: user.is_admin,
      },
      process.env.TOKEN
    );
    // console.log(token);
    return res.header("auth-token", token).send(token);
  } catch (err) {
    return res.status(500).send("Something went wrong");
  }
});

module.exports = router;
