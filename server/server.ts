import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb://localhost:27017"; // Local MongoDB
const client = new MongoClient(uri);

const dbName = "ARMENU";
let db: any;

client.connect().then(() => {
  db = client.db(dbName);
  console.log("Connected to MongoDB:", dbName);
}).catch(err => console.error(err));

app.post("/api/orders", async (req, res) => {
  try {
    const order = req.body;
    const collection = db.collection("orders");
    await collection.insertOne(order);
    res.status(201).send({ message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to place order" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
