const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhdj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("YoodaHostelDB");
    const foodCollection = database.collection("foods");
    const studentCollection = database.collection("students");
    const servedFoodCollection = database.collection("servedFood");

    // Food Post API
    app.post("/foods", async (req, res) => {
      const foods = req.body;
      const result = await foodCollection.insertOne(foods);
      res.json(result);
    });

    // Food Get API
    app.get("/foods", async (req, res) => {
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const cursor = foodCollection.find({});
      const count = await cursor.count();
      let foods;
      if (page) {
        foods = await cursor
          .sort({ _id: -1 })
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        foods = await cursor.sort({ _id: -1 }).toArray();
      }
      res.json({ foods, count });
    });

    // Food PUT API
    app.put("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: { name: req.body.name, price: req.body.price },
      };
      const result = await foodCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // Food delete API
    app.delete("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const result = await foodCollection.deleteOne({ _id: ObjectId(id) });
      res.json(result);
    });

    // Students POST API
    app.post("/students", async (req, res) => {
      const student = req.body;
      const result = await studentCollection.insertOne(student);
      res.json(result);
    });

    // Student GET API
    app.get("/students", async (req, res) => {
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const cursor = studentCollection.find({});
      const count = await cursor.count();
      let students;
      if (page) {
        students = await cursor
          .sort({ _id: -1 })
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        students = await cursor.sort({ _id: -1 }).toArray();
      }
      res.json({ students, count });
    });

    // Student PUT API
    app.put("/students", async (req, res) => {
      const status = req.body.status;
      const id = req.body.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = { $set: { status: status } };
      const result = await studentCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // Student Full Update API
    app.put("/studentProfile/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          name: req.body.name,
          roll: req.body.roll,
          age: req.body.age,
          class: req.body.class,
          hall: req.body.hall,
          status: req.body.status,
        },
      };
      const result = await studentCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // Student DELETE API
    app.delete("/students/:id", async (req, res) => {
      const id = req.params.id;
      const result = await studentCollection.deleteOne({ _id: ObjectId(id) });
      res.json(result);
    });

    // Food Serve POST API
    app.post("/served", async (req, res) => {
      const servedFood = req.body;
      const result = await servedFoodCollection.insertOne(servedFood);
      res.json(result);
    });

    // Food Serve GET API
    app.get("/served", async (req, res) => {
      const cursor = servedFoodCollection.find({});
      const servedFood = await cursor.sort({ _id: -1 }).toArray();
      res.json(servedFood);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Yooda Hostel server is running");
});

app.listen(port, () => {
  console.log("Yooda Hostel server is running on port", port);
});
