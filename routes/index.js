const express = require('express');
const mongoose= require('mongoose');
const path= require('path');

const router = express.Router();
const Document=mongoose.model('Document');
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.

router.get('/documents', (req, res) => {
    console.log('route /documents atteinte');
    Document.find().limit(10)
        .then((documents)=>{
            console.log(documents);

      
          res.render('index', {title: 'Medialogue', documents});  
        })
        .catch((error)=>{
      console.log(`Error fetching documents: ${error.message}`);
            res.send('Sorry, something went wrong!');
        });
});

module.exports = router;