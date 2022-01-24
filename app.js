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
// import Card from './models/card.js'
// import SelectedCard from './public/js/voting.js'





// grab content from cat api 
//we had an issue saving state 
let setCatArray = []

app.get("/", (req, res) => {
  fetch(`https://api.thecatapi.com/v1/images/search?limit=20`)
      .then(res => res.json())
      .then(response => {
          let catArray = response.map(obj => {
              return { url: obj.url, id: obj.id }
          }) 
          if(setCatArray.length == 0) {
            setCatArray = catArray
          } else {
            res.render("index", {array: setCatArray}) 
          }
         
    })
    
})

app.put('/cards', (req, res) => {
  console.log("RequestBody!!!!",req.body)
    db.collection('cards')
      .findOneAndUpdate({
        id: req.body.url
      }, 
      {
        $set: {
          downVotes: req.body.downVotes,
          upVotes: req.body.upVotes, 
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: true 
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })

  })

app.listen(process.env.PORT)