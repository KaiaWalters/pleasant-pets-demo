import fetch from 'node-fetch'
globalThis.fetch = fetch
import express from 'express'
import dotenv from 'dotenv'
import database from './config/database.js'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

var url = database.url
var db 
var app = express()
app.set('view engine', "ejs")
app.use(express.static('public'));
app.use(bodyParser.json())

dotenv.config()

mongoose.connect(url, (err, database) => {
  if (err) return console.log(err)
  db = database
}); 

// grab content from cat api 
//we had an issue saving state 
app.get("/", (req, res) => {

  fetch(`https://api.thecatapi.com/v1/images/search?order=DESC&limit=20`)
      .then(res => res.json())
      .then(response => {
        let catArray = response.map(obj => {
            return { url: obj.url, id: obj.id }
        }) 
        //move this render to another get request 
        console.log("here")
        saveCatImageArray({array: catArray})
        res.render("index", {array: catArray})    
       
    })
})

function getCats() {

}

function saveCatImageArray(images) {
  db.collection('images')
    .insertOne(images, function (err, result) {
      console.log(err)
      console.log('item has been inserted', result);
      db.close;
    });
}

app.put('/cards', (req, res) => {
  // console.log("RequestBody!!!!",req.body)
    db.collection('cards')
      .findOneAndUpdate({
        url: req.body.url
      }, 
      {
        $set: {
          upVotes: req.body.upVotes, 
          downVotes: req.body.downVotes
        }
      }, {
        //review this
        sort: {
          _id: -1
        },
        upsert: true 
      }, (err, result) => {

        //check out what res.send()
        //may cause reload, explain why
        //hit cor again

        if (err) {
          // console.log(err)
          return err
        }
       
        if (result) {
          // console.log(result)
          return result
        }

      })

  })


  // function saveCatImageArray(images) {
  //   fetch(`${db}/images`, {
  //     method: 'post', 
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify({
  //         'images': images, 
  //     })
  //   }).then(response => {
  //     console.log(response.json())
  //     return
  //   })
  // }

  function extendCatImageArray() { return "TODO" }

app.listen(process.env.PORT)