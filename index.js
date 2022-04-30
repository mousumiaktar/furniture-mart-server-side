const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// var MongoClient = require('mongodb').MongoClient;

var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.g5v7d.mongodb.net:27017,cluster0-shard-00-01.g5v7d.mongodb.net:27017,cluster0-shard-00-02.g5v7d.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-h4324x-shard-0&authSource=admin&retryWrites=true&w=majority`;
// MongoClient.connect(uri, function(err, client) {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g5v7d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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