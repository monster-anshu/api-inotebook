const connectToMongo = require("./db");
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { init } = require("glitch-deploy-helper");

async function main() {
  await init();
}

main();
// Connection to DB
connectToMongo();
//Avilable Routes
app.use(
  cors({
    origin: "https://app-inotebook.vercel.app",
  })
);
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.get("/api", (req, res) => {
  res.send("Hello Himanshu");
});
app.get("/", (req, res) => {
  res.send("Api working updated 69");
});
// app.use(express.static(path.join(__dirname, "../build")));
// app.get("/*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../build", "index.html"));
// });
app.listen(port, () => {
  console.log(`Example app listening at PORT = ${port}`);
});
