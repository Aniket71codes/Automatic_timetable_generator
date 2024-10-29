require('dotenv').config();
const { MongoClient } = require("mongodb");


async function run() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");

     const db = client.db("myupes");  
    const collection = db.collection("myupes");  
     const documents = await collection.find({}).toArray();

     console.log(documents);

      documents.forEach(doc => 
        {
          if (doc.sapId === 500122649) {
          console.log(doc.role);
        }})

  } 
  catch (e) {
    console.error("Error connecting to MongoDB:", e);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
