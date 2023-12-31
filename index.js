const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
// =================================================================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmvmv30.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // =======================All collections are here ==========================================

    const AllUserTasksCollection = client
      .db("ToDoList")
      .collection("AllUserTasks");

    // =================================================================
    // console.log(email);
    // let query = {};
    // if (req.query.email) {
    //   query = { ProductOwnerEmail: email };
    // }
    // console.log(query);
    // ======================TO DO LIST ===========================================
    app.post("/AllUserTasks", async (req, res) => {
      const item = req.body;
      const result = await AllUserTasksCollection.insertOne(item);
      res.send(result);
    });
    app.get("/AllUserTasks", async (req, res) => {
      const result = await AllUserTasksCollection.find().toArray();
      res.send(result);
    });

    app.get("/userAddedTaskByEmail", async (req, res) => {
      const email = req.query.email;
      const query = { TaskUserEmail: email };
      const result = await AllUserTasksCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });
    app.patch("/userTaskOngoing/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          OngoingTask: "true",
        },
      };
      const result = await AllUserTasksCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    app.patch("/userTaskComplete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          CompleteTaskStatus: "true",
        },
      };
      const result = await AllUserTasksCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // =================================================================
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// =================================================================
app.get("/", (req, res) => {
  res.send("Gadget server is running");
});

app.listen(port, () => {
  console.log(`Gadget server is sitting on port ${port}`);
});
