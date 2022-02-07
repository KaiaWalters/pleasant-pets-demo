import fetch from 'node-fetch'
globalThis.fetch = fetch
import express from 'express'
import dotenv, { parse } from 'dotenv'
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
        if (err) {
          return err
        }
        if (result) {
          return result
        }
      })
  })

app.get("/", (req, res) => {
  fetch(`https://api.thecatapi.com/v1/images/search?limit=20`)
    .then(res => res.json())
    .then(response => {
      let images = response.map(obj => {
          return { url: obj.url}
      })
      console.log(images)
      res.render("index", { array: images})
  })
})

app.listen(process.env.PORT)

//On first visit to the page the user should be able to view cat images
//Should be able to vote on images 
//None of this data is required to be saved