const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// var MongoClient = require('mongodb').MongoClient;

var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.g5v7d.mongodb.net:27017,cluster0-shard-00-01.g5v7d.mongodb.net:27017,cluster0-shard-00-02.g5v7d.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-h4324x-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        await client.connect();
        const inventoryCollection = client.db('furnitureMart').collection('inventory');


        app.get('/inventory', async(req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        });


        app.get('/inventory/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const inventory = await inventoryCollection.findOne(query);
            res.send(inventory);
        })


        app.post('/inventory', async(req, res) =>{
            const newInventory = req.body;
            console.log(newInventory);
            const result = await inventoryCollection.insertOne(newInventory);
            res.send(result);
        })


        app.put("/inventory/:id", async (req, res) => {
            const id = req.params.id;
            const updatedStock = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
        
            const updateDoc = {
              $set: {
                quantity: updatedStock.quantity,
              },
            };
            const result = await inventoryCollection.updateOne(filter, updateDoc, options);
            res.send(result);
          });



        app.delete('/inventory/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);
        })


        app.get('/inventories', async(req, res) =>{
            const email = req.query.email;
            console.log(email);
            const query = {email: email};
            const cursor = inventoryCollection.find(query);
            const inventories = await cursor.toArray();
            res.send(inventories);
        })


    }
    finally{

    }
}
run().catch(console.dir);


app.get('/',(req, res)=>{
    res.send('Server is Running');
})

app.listen(port, ()=>{
    console.log('listening to port', port);
});