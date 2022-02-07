import fetch from 'node-fetch'
globalThis.fetch = fetch
import dotenv from 'dotenv'
import database from './config/database.js'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import { ObjectId } from 'mongodb'
import express from 'express'
var app = express()
app.use(express.static('public'));
app.set('view engine', "ejs")

var url = database.url
var db 

app.use(bodyParser.json())

dotenv.config()

mongoose.connect(url, (err, database) => {
  if (err) return console.log(err)
  db = database
}); 

let wasFetchCalled = false 

app.get("/", (req, res) => {
  console.log("server started")

  if(wasFetchCalled) {
    console.log("queuing up cards to display")
    queueImages()
    .then( results => {
      res.render("index", {array: results})
    })
  
    console.log("RENDERING COMPLETE")
  } 
  else {
    fetch(`https://api.thecatapi.com/v1/images/search?limit=20`)
    .then(res => res.json())
    .then(response => {
      let urls = response.map(obj => {
          return obj.url
      })
      let imageObj = response.map(obj => {
        return {url: obj.url}
    })
      console.log("SAVING IMAGES")
      saveNewCards(urls)
      res.render("index", { array: imageObj})
    })
  }
})

app.put('/cards', (req, res) => {
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
        sort: {
          _id: -1
        },
        upsert: true 
      }, (err, result) => {
          return {err, result}
      })
  })

  async function queueImages() {
    let images = []
    console.log("Get the last inserted document")
    await db.collection("cards").find({}, {"array": true}).sort({_id: 1}).limit(20)
    .forEach(function(item){
        images.push({url: item.url,upVotes: item.upVotes, downVotes: item.downVotes})
    })
    return images
   }

   function saveNewCards(imageArray) {
    wasFetchCalled = true 
    let count = 0
    let documents = imageArray.map( url => {
      return { url: url, upVotes: 0, downVotes: 0 }
    })

    db.collection('cards')
    .insertMany(
      documents,
      {ordered: true}
    )
    .then( count = documents.length )

    console.log(`${count} NEW CARDS HAVE BEEN GENERATED`)
  }

app.listen(process.env.PORT)

