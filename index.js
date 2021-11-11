const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://watchshop:hbOVLjusrAgEtZ62@cluster0.cnelf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("watch-shop").collection("services");
  const orderCollection = client.db("watch-shop").collection("orders");
  const testimonialCollection = client.db("watch-shop").collection("testimonials");
  const adminCollection = client.db("watch-shop").collection("admins");

  /// add nwe service
  app.post('/addService', (req, res) => {
    serviceCollection.insertOne(req.body)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
      })
  });

  //  make route and get data
  app.get("/allService", (req, res) => {
    serviceCollection.find({}).toArray((err, results) => {
      res.send(results);
    })
  })

  //  make route and get data
  app.get('/service/:id', (req, res) => {
    serviceCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  });

  // add addorder option
  app.post('/addOrder', (req, res) => {
    orderCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });

  // get all orders data
  app.get('/allOrder', (req, res) => {
    orderCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  // get query data by email and id 
  app.get('/orders', (req, res) => {
    const queryEmail = req.query.email;
    orderCollection.find({ email: queryEmail })
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  // delete order
  /*   app.delete("/delteOrder/:id", async (req, res) => {
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    }); */

  // delete orders data 
  app.delete('/delteOrder/:id', (req, res) => {
    orderCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then(result => {
        console.log('hello', result);
        res.send(result)
      })
  });


  // uptade status
  app.patch('/update/:id', (req, res) => {
    orderCollection.updateOne({ _id: req.params.id }, {
      $set: { status: req.body.status }
    })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  });

  // add review
  app.post('/addReview', (req, res) => {
    testimonialCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });

  // get all reviews
  app.get('/allReview', (req, res) => {
    testimonialCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  // make admin
  app.post('/addAdmin', (req, res) => {
    adminCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });

  // get admins
  app.get('/admin', (req, res) => {
    const queryEmail = req.query.email;
    adminCollection.find({ email: queryEmail })
      .toArray((err, documents) => {
        res.send(documents.length > 0);
      })
  });

  // delete collection data 
  app.delete('/delete/:id', (req, res) => {
    serviceCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then(result => {
        console.log(result);
        res.send(result)
      })
  });

});

app.get('/', (req, res) => {
  res.send("hello watch server working")
})

app.listen(port)