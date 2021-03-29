const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//import route
const authRoute = require("./routes/auth");
const courseRoute = require("./routes/course");
const enrollRoute = require("./routes/enrolled");
const quizRoute = require("./routes/quiz");
const fileRoute = require("./routes/file");

const cors = require("cors");
const PORT = process.env.PORT || 3000;

dotenv.config();

//connect DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (error) => {
    if (error === null) console.log("CONNECTION Sucessful");
    else console.log(error);
  }
);

//Middleware
app.use(express.json());
app.use(cors());

//Route middleware
app.use("/api/user", authRoute);
app.use("/api/course", courseRoute);
app.use("/api/enroll", enrollRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/file", fileRoute);
//IF NO MATCH
app.use("*", (req, res) => res.status(404).send("404 Not found"));
// app.listen(process.env.PORT, () => console.log("Server up and running"));
app.listen(PORT, () => console.log(`Server up and running at port ${PORT}`));
