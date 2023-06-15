import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
//   useNewUrlParser: true,
// });

mongoose.connect(
  "mongodb+srv://admin:test@cluster0.8aq31rn.mongodb.net/wikiDB",
  {
    useNewUrlParser: true,
  }
);

const wikiSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { versionKey: false }
);

const Article = mongoose.model("Article", wikiSchema);

app.use(bodyParser.urlencoded({ extended: true }));

/* Here is for all the routes at one go */

app
  .route("/articles")

  .get(function (req, res) {
    Article.find().then((data) => {
      res.send(data);
    });
  })

  .post(function (req, res) {
    const articles = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    articles.save();
    res.send("Your data is saved");
  })

  .delete(function (req, res) {
    Article.deleteMany().then(
      res.send("All the collection wiped out, No data left behind")
    );
  });

/* Here is for the specific routes routes at one go */

// :title it represents that I am kind of variable and I am passed through url
// And can be retrieved from the url via req.params.title

app
  .route("/articles/:title")

  .get(function (req, res) {
    Article.find({ title: { $regex: req.params.title, $options: "i" } }).then(
      (data) => {
        res.send(data);
      }
    );
  })

  .post(function (req, res) {
    const articles = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    articles.save();
    res.send("Your data is saved");
  })

  .delete(function (req, res) {
    Article.deleteMany().then(
      res.send("All the collection wiped out, No data left behind")
    );
  });

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
