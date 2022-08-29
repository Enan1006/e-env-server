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

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carsCollection.findOne(query);
            res.send(result)
        });

        app.post('/inventories', async (req, res) => {
            const data = req.body;
            const query = {
                name: data.name,
                description: data.description,
                price: data.price,
                quantity: data.quantity,
                supplier: data.supplier,
                image: data.image,
                user: data.user
            };
            const result = await carsCollection.insertOne(query);
            res.send(result)
        });

        app.get('/inventory', async (req, res) => {
            const email = req.query.email;
            const query = { user: email };
            const cursor = carsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });

        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await carsCollection.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("Deleted Successfully");
            }
            else {
                console.log("Unsuccessful attempt")
            }
        });

        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const quantity = req.body.quantity;
            console.log(quantity);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: quantity
                }
            }
            const result = await carsCollection.updateOne(filter, updateDoc, options);
            console.log(result);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})