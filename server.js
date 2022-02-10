import fetch from 'node-fetch'
globalThis.fetch = fetch
import dotenv from 'dotenv'
import database from './config/database.js'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import express from 'express'
var app = express()
app.use(express.static('public'));
app.set('view engine', "ejs")

var url = database.url
var db 
let docCount

app.use(bodyParser.json())

dotenv.config()
//call back func when a is done do b
mongoose.connect(url, (err, database) => {
  if (err) return console.log(err)
  db = database
  docCount = db.collection('cards').count()
}); 
mongoose.connection.on('connected', () => console.log('Connected'));
mongoose.connection.on('error', () => console.log('Connection failed with - ',err));

//in order to populate the db with images, you will need to set LOAD_MORE_IMAGES to true.
//After you have the set amount of images you want to be voted on, set the env back
// if(process.env.LOAD_MORE_IMAGES) {
//   getImages()
// }

// reduce # of calls to external services to increa
//check if db contains cards

//if db {}
//if db is empty {
    //fetch cat image urls from cat.api 
    //generate a new set of cards 
    //save this set of cards to mongo db
//}
  //queue a number of cards 
  //display that set of cards in the app body

//else  user requires more cards to vote on
  //fetch cat image urls from cat.api 
    //generate a new set of cards 
    //save this set of cards to mongo db
    //queue a number of cards 
    //display that set of cards in the app body

app.get("/", async (req, res) => {  
  //mind what you have in the get request because the time that it takes to complete the functions in 
  //here will delay the page rendering f the user
    console.log("server started") 
    console.log("queuing up cards to display")
    var limit = req.url.match(/\d+/) == null ? 5: parseInt(req.url.match(/\d+/).toString())
    
    if(docCount < 1) {
      getImages()
    }
    queueImages(limit)
    .then( results => {
      results.sort((a,b) => {
        let first = a.upVotes - a.downVotes
        let second = b.upVotes - b.downVotes
        return second - first
      })
      res.render("index", {array: results})
    })
  
    console.log("RENDERING COMPLETE")
})



app.put('/cards', (req, res) => {
  console.log("UPDATING VOTES", req.body.url)
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
          _id: 1
        },
        upsert: false 
      }, (err, result) => {
          console.log(err,result)
          return {err, result}
      })
  })

  // async function databaseIsEmpty(number) {
  
  // }

  function getImages() {
    fetch(`https://api.thecatapi.com/v1/images/search?limit=${process.env.LIMIT}`)
    .then(res => res.json())
    .then(response => {
      let urls = response.map(obj => {
          return obj.url
      })
      console.log("SAVING IMAGES")
      saveNewCards(urls)
    })
  }

  async function queueImages(limitCount) {
    let images = []
    console.log("Get the last inserted document")
    await db.collection("cards").find({}, {"array": true}).sort({_id: 1}).limit(limitCount)
    .forEach(function(item){
        images.push({url: item.url,upVotes: item.upVotes, downVotes: item.downVotes})
    })
    return images
   }

   function saveNewCards(imageArray) {
    let count = 0
    let documents = imageArray.map( url => {
      return { url: url, upVotes: 0, downVotes: 0 }
    })
    db.collection('cards')
    .insertMany(
      documents,
      {ordered: true}
    )
    .then( 
      count = documents.length 
    )

    console.log(`${count} NEW CARDS HAVE BEEN GENERATED`)
  }

app.listen(process.env.PORT)

