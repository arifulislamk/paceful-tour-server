const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// peacefulTour
// 79U5y3vhg9wRcWnz
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://peacefulTour:79U5y3vhg9wRcWnz@cluster0.zwicj3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        await client.connect();
        // Send a ping to confirm a successful connection

        const touristUserCollection = client.db("touristsDB").collection('tourist')

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await touristUserCollection.insertOne(user);
            res.send(result)
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('My Peaceful Website Server On Port 5000 Ready');
})

app.listen(port, () => {
    console.log(`My Server Is Running Now On Port , ${port}`)
})

