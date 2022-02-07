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
let imageQueue = []

app.get("/", (req, res) => {
  console.log("start")
  if(wasFetchCalled) {
    console.log("display previously saved images")
    queueImages().then( result => 
      res.render("index", {array: result.array}))
    } 
  else {
    fetch(`https://api.thecatapi.com/v1/images/search?limit=20`)
    .then(res => res.json())
    .then(response => {
      let images = response.map(obj => {
          return { url: obj.url}
      })
      console.log("save images")
      saveImages(images)

      //send data to client side
      // res.send({wasFetchCalled: true})
      res.render("index", { array: images})
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
    let callItem
    console.log("Get the last inserted document")
    await db.collection("images").find({}, {"array": true}).sort({_id: 1}).limit(1)
    .forEach(function(item){
      callItem = item 
    })

    return callItem
    // var myDocument = returnedCursor.hasNext() ? returnedCursor.next() : null;
    // if(myDocument) {
    //   let documentArray = myDocument
    //   console.log("document", JSON.stringify(documentArray))
    // }
    // if(false) {    
    //   console.log("invalid image array id") 
    // } else {
      // let dbResult = db.collection('images')
      // .findOne(
      //   {_id: imageArrayId},
      //    (error, result) => {
      //       if(result) {
      //         console.log("pushing array of images into image queue to be rendered", result)
      //         imageQueue.push(result.array)
      //         return result.array
      //       }else {
      //         console.log("image array can not be found")
      //       }
      //     },
      //   )
      //   console.log("result", dbResult)
     // }
    }
 
  async function saveImages(imageArray) {
    wasFetchCalled = true 
    await  db.collection('images').insertOne({array: imageArray})
    .then((result) => {
      let insertedId =  result.insertedId
      return insertedId
     })
  }

  //load app contains multiple promises 
  //issue is a race condition 
  //the first request is not done by the time that the second on e is called 
// app.get("/",(req, res) => {
//   loadApp((imageArray) => {
//     res.render("index", {array: imageArray})
//     console.log("Last Step")
//   })
// })

app.listen(process.env.PORT)

