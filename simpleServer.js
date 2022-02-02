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

app.get('/images', (req, res) => {
 fetch(`https://api.thecatapi.com/v1/images/search?limit=20`)
  .then(res => res.json())
  .then(response => {
    let images = response.map(obj => {
        return { url: obj.url}
    })
    res.json(images)
    return images 
  })
})

let parsedImageArray = []

function loadApp(req, res) {
  res.render("index", {array: {array: req}})
}

app.put("/", (req, res) => {
  console.log("Should be First")
  parsedImageArray = JSON.parse(req.body.images)
  console.log(parsedImageArray)
})

app.get("/", (req, res) => {
  console.log("Should be Second", parsedImageArray)
  if(parsedImageArray.length > 0) {
    loadApp(parsedImageArray, res)
  }else {
    loadApp(parsedImageArray, res)
    console.log("error")
  }
})

app.listen(process.env.PORT)