import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config'; 

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.aqii4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const connect = async () => {
  try {
    await client.connect();
    await client.db("survey").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
    return client.db("survey");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
};

export default connect;
