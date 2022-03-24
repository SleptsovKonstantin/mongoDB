const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const port = 5000;

app.use(cors());

const { Schema } = mongoose;
const block = new Schema({
  text: String,
  age: Number,
  description: String,
  owner: String,
  country: String,
});

const Wall = mongoose.model("wall", block);

const uri =
  "mongodb+srv://SleptsovKonstantin:sleptsov123321@cluster0.omltj.mongodb.net/Todolist?retryWrites=true&w=majority";
mongoose.connect(uri);

app.use(express.json());

app.get("/all", (req, res) => {
  Wall.find().then((result) => {
    res.send({ data: result });
  });
});

app.get("/filter", (req, res) => {
  Wall.find(req.query).then((result) => {
    res.send({ data: result });
  });
});

app.get("/sort", (req, res) => {
  Wall.find().sort(req.query).then((result) => {
    res.send({ data: result });
  });
});

app.get("/pagination", (req, res) => {
  const page = req.query.page;
  Wall.find().skip(10 * (page - 1)).limit(10).then((result) => {
    res.send({ data: result });
  });
});

app.get("/sortPagination", (req, res) => {
  const page = req.query.page;
  Wall.find().sort(req.query).skip(10 * (page - 1).limit(10)).then((result) => {
    res.send({ data: result });
  });
});

app.get("/value", (req, res) => {
  const filter = ["text", 'age'];
  Wall.find({}, filter).then((result) => {
    console.log(result);
    
    res.send({ data: result });
  });
});

app.post("/create", (req, res) => {
  const info = new Wall(req.body);
  info.save().then((result) => {
    Wall.find().then((result) => {
      res.send({ data: result });
    });
  });
});

app.patch("/update", (req, res) => {
  const body = req.body;
  const { _id } = body;
  Wall.updateOne({ _id: _id }, body).then(() => {
    Wall.find().then((result) => {
      res.send({ data: result });
    });
  });
});

app.delete("/delete", (req, res) => {
  const id = req.query._id;
  Wall.deleteOne({ _id: id }).then(() => {
    Wall.find().then((result) => {
      res.send({ data: result });
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
