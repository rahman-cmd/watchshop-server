const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnelf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("watch-shop").collection("services");
  const orderCollection = client.db("watch-shop").collection("orders");
  const testimonialCollection = client.db("watch-shop").collection("testimonials");
  const adminCollection = client.db("watch-shop").collection("admins");

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

  app.get('/service/:id', (req, res) => {
    serviceCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  });

  app.post('/addOrder', (req, res) => {
    orderCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });

  app.get('/allOrder', (req, res) => {
    orderCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  app.get('/orders', (req, res) => {
    const queryEmail = req.query.email;
    orderCollection.find({ email: queryEmail })
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  app.patch('/update/:id', (req, res) => {
    orderCollection.updateOne({ _id: req.params.id }, {
      $set: { status: req.body.status }
    })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  });

  app.post('/addReview', (req, res) => {
    testimonialCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });

  app.get('/allReview', (req, res) => {
    testimonialCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  });

  app.post('/addAdmin', (req, res) => {
    adminCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });

  app.get('/admin', (req, res) => {
    const queryEmail = req.query.email;
    adminCollection.find({ email: queryEmail })
      .toArray((err, documents) => {
        res.send(documents.length > 0);
      })
  });

  app.delete('/delete/:id', (req, res) => {
    serviceCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  });

});

app.get('/', (req, res) => {
  res.send("hello watch server working")
})

app.listen(port)