const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.TASKNEXT_USER}:${process.env.TASKNEXT_PASS}@cluster0.kothmtv.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const tasksCollection = client.db("TaskNextDB").collection("tasks");
    const userCollection = client.db("TaskNextDB").collection("users");

    app.post("/user", async (req, res) => {
      const user = req.body;
      const alluser = await userCollection.find().toArray()
      const isCreat = alluser.find(creatUser => creatUser.email === user.email)
      if(isCreat){
        return;
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.get("/oneuser/:email", async(req, res) => {
      const email = req.params.email
      const query = {email: email}
      const result = await userCollection.findOne(query)
      res.send(result)
    })

    app.get("/tasks", async(req, res) => {
        const result = await tasksCollection.find().toArray()
        res.send(result)
    })

    app.get("/todotask", async(req, res) => {
      const query = {status: "to-do"}
      const result = await tasksCollection.find(query).toArray()
      res.send(result)
    })

    app.get("/ongingtask", async(req, res) => {
      const query = {status: "Ongoing"}
      const result = await tasksCollection.find(query).toArray()
      res.send(result)
    })
    app.get("/completedtask", async(req, res) => {
      const query = {status: "Completed"}
      const result = await tasksCollection.find(query).toArray()
      res.send(result)
    })
    
    app.get("/ongingtask", async(req, res) => {
      const query = {status: ""}
      const result = await tasksCollection.find(query).toArray()
      res.send(result)
    })

    app.post("/addtask",async (req, res) => {
        const task = req.body
        const result = await tasksCollection.insertOne(task)
        res.send(result)
    })

    app.put("/addongoing/:id", async(req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const uodeteDoc = {
        $set: {
          status: "Ongoing"
        }
      }
      const result = await tasksCollection.updateOne(filter,uodeteDoc)
      res.send(result)
    })
    app.put("/addcomplete/:id", async(req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const uodeteDoc = {
        $set: {
          status: "Completed"
        }
      }
      const result = await tasksCollection.updateOne(filter,uodeteDoc)
      res.send(result)
    })

    app.delete("/deletetask/:id", async (req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result = await tasksCollection.deleteOne(filter)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("TaskNext is runing");
})
app.listen(port, () => {
    console.log(`TaskNext is runing on Port ${port}`);
})