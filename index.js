const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwicj3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Send a ping to confirm a successful connection

        const allSpotsCollection = client.db("allSpotsDB").collection("spot")
        const countryCollection = client.db("countryDB").collection("country")
        const touristUserCollection = client.db("touristsDB").collection('tourist');

        // allSpotsCollection database code 
        app.get('/spot', async (req, res) => {
            const cursor = allSpotsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/myList/:useremail', async (req, res) => {
            const user = req.params.useremail;
            const query = { useremail: user }
            const result = await allSpotsCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allSpotsCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/:country_name', async(req, res)=> {
            const country = req.params.country_name ;
            const query = { country : country} ;
            const result = await allSpotsCollection.find(query).toArray() ;
            res.send(result)
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedSpot = req.body;
            const updateDoc = {
                $set: {
                    spotsname: updatedSpot.spotsname,
                    image: updatedSpot.image,
                    country: updatedSpot.country,
                    location: updatedSpot.location,
                    discription: updatedSpot.discription,
                    avaragecost: updatedSpot.avaragecost,
                    seasonality: updatedSpot.seasonality,
                    traveltime: updatedSpot.traveltime,
                    totalvisitorsperyear: updatedSpot.totalvisitorsperyear,
                }
            }
            const result = await allSpotsCollection.updateOne(query, updateDoc , options)
            res.send(result)
        })

        app.post('/spot', async (req, res) => {
            const spot = req.body;
            console.log(spot)
            const result = await allSpotsCollection.insertOne(spot)
            res.send(result)
        })

        app.delete('/spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allSpotsCollection.deleteOne(query);
            res.send(result)
        })

        // email registration user apis data 
        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await touristUserCollection.insertOne(user);
            res.send(result)
        })

        // country database apis 
        app.get('/country', async(req, res)=> {
            const coursor = countryCollection.find() ;
            const result = await coursor.toArray() ;
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

