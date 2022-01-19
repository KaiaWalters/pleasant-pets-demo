const { fileURLToPath } = require('url');

import fetch from 'node-fetch'
globalThis.fetch = fetch
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

var app = express()

app.set('view engine', "ejs")
app.use(express.static('public'));


app.get("/", (req, res) => {

    fetch(`https://api.thecatapi.com/v1/images/search?limit=20`)
        .then(res => res.json())
        .then(response => {
            console.log(response)
            let catArray = response.map(obj => {
                return obj.url
            }) 
            console.log(catArray)
            res.render("index", {array: catArray, upVotes: 10, downVotes: 10}) 
        })
})

app.put('/', (req, res) => {

    db.collection('messages')
      .findOneAndUpdate({

        quote: req.body.quote //HERE HERE

      }, {
        $set: {
          isSelected: req.body.isSelected
        }
      }, {
        sort: {
          _id: -1
        },
        upsert: true //hwre
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })

console.log(`Your port is ${process.env.PORT}`)
app.listen(3000)

