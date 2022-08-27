const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("E-ENV server is running")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jjoixmb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const carsCollection = client.db("eEnv").collection("carsCollection");

        app.get('/featurecars', async (req, res) => {
            const query = {};
            const cursor = carsCollection.find(query).limit(6);
            const result = await cursor.toArray();
            res.send(result)
        });

        app.get('/inventories', async (req, res) => {
            const query = {};
            const cursor = carsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });


    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})